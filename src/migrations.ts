import type { PGlite, PGliteInterface } from '@electric-sql/pglite'
import eventsTableUp from '../db/migrations-client/01-create-tables.sql?raw'
import postInitialSyncIndexes from '../db/migrations-client/post-initial-sync-indexes.sql?raw'
import postInitialSyncFtsIndex from '../db/migrations-client/post-initial-sync-fts-index.sql?raw'

export async function migrate(pg: PGlite) {
  const tables = await pg.query(`
    SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
  `)

  if (tables.rows.length === 0) {
    await pg.exec(eventsTableUp)
  }
}

export async function postInitialSync(pg: PGliteInterface) {
  const commands = postInitialSyncIndexes
    .split('\n')
    .map((command) => command.trim())
    .filter((command) => command.length > 0)

  for (const command of commands) {
    // wait 100ms between commands
    console.time(`command: ${command}`)
    await pg.exec(command)
    console.timeEnd(`command: ${command}`)
  }
}

export async function createFTSIndex(pg: PGliteInterface) {
  await pg.exec(postInitialSyncFtsIndex)
}
