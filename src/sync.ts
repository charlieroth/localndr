import { Mutex } from '@electric-sql/pglite'
import type { PGliteWithLive } from '@electric-sql/pglite/live'
import type { PGliteWithSync } from '@electric-sql/pglite-sync'
import type { EventChange, ChangeSet } from './utils/changes.ts'
import { postInitialSync } from './migrations.ts'
import { useDatabaseStore, SyncStatus } from './stores/databaseStore'

const WRITE_SERVER_URL = import.meta.env.VITE_WRITE_SERVER_URL ?? 'http://localhost:3001'
const ELECTRIC_API_URL = import.meta.env.VITE_ELECTRIC_API_URL ?? 'http://localhost:3000'
const APPLY_CHANGES_URL = `${WRITE_SERVER_URL}/apply-changes`

type PGliteWithExtensions = PGliteWithLive & PGliteWithSync

export async function startSync(pg: PGliteWithExtensions) {
  await startSyncToDatabase(pg)
  startWritePath(pg)
}

async function startSyncToDatabase(pg: PGliteWithExtensions) {
  // Get store access outside of React component
  const store = useDatabaseStore.getState()
  const setStatus = (status: SyncStatus, message: string) => {
    store.setSyncStatus(status, message)
  }

  const events = await pg.query(`SELECT 1 FROM event LIMIT 1`)
  const hasEventsAtStart = events.rows.length > 0

  // We're tracking the sync state of both the shape data and post-initial sync operations
  let postInitialSyncDone = false

  if (!hasEventsAtStart) {
    setStatus('syncing', 'Downloading shape data...')
  }

  let postInitialSyncDoneResolver: () => void
  const postInitialSyncDonePromise = new Promise<void>((resolve) => {
    postInitialSyncDoneResolver = resolve
  })

  const doPostInitialSync = async () => {
    if (!hasEventsAtStart && !postInitialSyncDone) {
      postInitialSyncDone = true
      setStatus('syncing', 'Creating indexes...')
      await postInitialSync(pg)
      postInitialSyncDoneResolver()
    }
  }

  const eventUrl = new URL(`${ELECTRIC_API_URL}/v1/shape`)
  const eventsSync = await pg.sync.syncShapeToTable({
    shape: {
      url: eventUrl.toString(),
      params: {
        table: 'event',
      },
    },
    table: 'event',
    primaryKey: ['id'],
    shapeKey: 'event',
    commitGranularity: 'up-to-date',
    useCopy: true,
    onInitialSync: async () => {
      await pg.exec(`ALTER TABLE event ENABLE TRIGGER ALL`)
      doPostInitialSync()
    },
  })

  eventsSync.subscribe(
    () => {
      if (!hasEventsAtStart && !postInitialSyncDone) {
        setStatus('syncing', 'Inserting events...')
      }
    },
    (error) => {
      console.error('eventsSync error: ', error)
      setStatus('error', `Sync error: ${error.message || 'Unknown error'}`)
    }
  )

  if (!hasEventsAtStart) {
    await postInitialSyncDonePromise
    await pg.query(`SELECT 1;`) // ensure PGlite is idle
  }
  
  setStatus('ready', 'Database ready')
}

const syncMutex = new Mutex()

async function startWritePath(pg: PGliteWithExtensions) {
  await pg.live.query<{
    event_count: number
  }>(
    `SELECT * FROM (SELECT count(id) as event_count FROM event WHERE synced = false)`,
    [],
    async (results) => {
      const { event_count } = results.rows[0]
      if (event_count > 0) {
        await syncMutex.acquire()
        try {
          doSyncToServer(pg)
        } finally {
          syncMutex.release()
        }
      }
    }
  )
}

// Call wrapped in mutex to prevent multiple sync from happening at the same time
async function doSyncToServer(pg: PGliteWithExtensions) {
  let eventChanges: EventChange[] = []
  await pg.transaction(async (tx) => {
    const eventRes = await tx.query(`
      SELECT
          id,
          title,
          description,
          start_date,
          end_date,
          created,
          modified,
          modified_columns,
          new,
          deleted
      FROM event
      WHERE synced = false AND sent_to_server = false
    `)
    eventChanges = eventRes.rows as EventChange[]
  })

  const changeSet: ChangeSet = {
    events: eventChanges!,
  }

  const response = await fetch(APPLY_CHANGES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(changeSet),
  })

  if (!response.ok) {
    // TODO: Want to check which changes have failed and save
    // that information to the databaes, maybe a `sync_errors` column on the row effected.
    throw new Error('Failed to apply changes')
  }

  await pg.transaction(async (tx) => {
    // Mark all changes as sent to the server, check that the modified
    // timestamp has not changed in the meantime
    tx.exec('SET LOCAL electric.bypass_triggers = true')
    for (const event of eventChanges!) {
      await tx.query(
        `
          UPDATE event
          SET sent_to_server = true
          WHERE id = $1 AND modified = $2
        `,
        [event.id, event.modified]
      )
    }
  })
}