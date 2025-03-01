import { Mutex } from '@electric-sql/pglite'
import type { PGliteWithLive } from '@electric-sql/pglite/live'
import type { PGliteWithSync } from '@electric-sql/pglite-sync'
import type { EventChange, ChangeSet } from './utils/changes.ts'
import { postInitialSync } from './migrations.ts'
import { useState } from 'react'
import { useEffect } from 'react'

const WRITE_SERVER_URL = import.meta.env.VITE_WRITE_SERVER_URL ?? 'http://localhost:3001'
const ELECTRIC_API_URL = import.meta.env.VITE_ELECTRIC_API_URL ?? 'http://localhost:3000'
const APPLY_CHANGES_URL = `${WRITE_SERVER_URL}/apply-changes`

type SyncStatus = 'initial-sync' | 'done'
type PGliteWithExtensions = PGliteWithLive & PGliteWithSync

export async function startSync(pg: PGliteWithExtensions) {
  await startSyncToDatabase(pg)
  startWritePath(pg)
}

async function startSyncToDatabase(pg: PGliteWithExtensions) {
  const events = await pg.query(`SELECT 1 FROM event LIMIT 1`)
  const hasEventsAtStart = events.rows.length > 0

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventShapeInitialSyncDone = false
  let postInitialSyncDone = false

  if (!hasEventsAtStart) {
    updateSyncStatus('initial-sync', 'Downloading shape data...')
  }

  let postInitialSyncDoneResolver: () => void
  const postInitialSyncDonePromise = new Promise<void>((resolve) => {
    postInitialSyncDoneResolver = resolve
  })

  const doPostInitialSync = async () => {
    if (!hasEventsAtStart && !postInitialSyncDone) {
      postInitialSyncDone = true
      updateSyncStatus('initial-sync', 'Creating indexes...')
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
      eventShapeInitialSyncDone = true
      await pg.exec(`ALTER TABLE event ENABLE TRIGGER ALL`)
      doPostInitialSync()
    },
  })

  eventsSync.subscribe(
    () => {
      if (!hasEventsAtStart && !postInitialSyncDone) {
        updateSyncStatus('initial-sync', 'Inserting events...')
      }
    },
    (error) => {
      console.error('eventsSync error: ', error)
    }
  )

  if (!hasEventsAtStart) {
    await postInitialSyncDonePromise
    await pg.query(`SELECT 1;`) // esnure PGlite is idle
  }
  updateSyncStatus('done')
}

const syncMutex = new Mutex()

async function startWritePath(pg: PGliteWithExtensions) {
  pg.live.query<{
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
          start,
          end,
          created,
          modified
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

export function updateSyncStatus(newStatus: SyncStatus, message?: string) {
  localStorage.setItem('syncStatus', JSON.stringify([newStatus, message]))
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: 'syncStatus',
      newValue: JSON.stringify([newStatus, message]),
    })
  )
}

export function useSyncStatus() {
  const [syncStatus, setSyncStatus] = useState<[SyncStatus, string]>(() => {
    const currentSyncStatusJson = localStorage.getItem('syncStatus')
    const currentSyncStatus: [SyncStatus, string] = currentSyncStatusJson
      ? JSON.parse(currentSyncStatusJson)
      : ['initial-sync', 'Starting sync...']
    return currentSyncStatus
  })

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'syncStatus' && e.newValue) {
        const [newStatus, message] = JSON.parse(e.newValue)
        setSyncStatus([newStatus, message])
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return syncStatus
}


let initialSyncDone = false

export function waitForInitialSyncDone() {
  return new Promise<void>((resolve) => {
    if (initialSyncDone) {
      resolve()
      return
    }
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'syncStatus' && e.newValue) {
        const [newStatus] = JSON.parse(e.newValue)
        if (newStatus === 'done') {
          window.removeEventListener('storage', handleStorageChange)
          initialSyncDone = true
          resolve()
        }
      }
    }

    // Check current status first
    const currentSyncStatusJson = localStorage.getItem('syncStatus')
    const [currentStatus] = currentSyncStatusJson
      ? JSON.parse(currentSyncStatusJson)
      : ['initial-sync']

    if (currentStatus === 'done') {
      initialSyncDone = true
      resolve()
    } else {
      window.addEventListener('storage', handleStorageChange)
    }
  })
}