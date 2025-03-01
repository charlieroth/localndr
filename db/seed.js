import postgres from 'postgres'
import { generateEvents } from './generate-data.js'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

const DATABASE_URL = process.env.DATABASE_URL
const EVENTS_TO_LOAD = process.env.NUM_EVENTS ? Number(process.env.NUM_EVENTS) : 360
const TX_BATCH_SIZE = process.env.TX_BATCH_SIZE ? Number(process.env.TX_BATCH_SIZE) : 90
const BATCH_SIZE = 90
const events = generateEvents(EVENTS_TO_LOAD)

console.info(`Connecting to PostgreSQL at ${DATABASE_URL}`)
const sql = postgres(DATABASE_URL)

async function batchInsert(sql, table, columns, dataArray, batchSize = 90) {
  for (let i = 0; i < dataArray.length; i += batchSize) {
    const batch = dataArray.slice(i, i + batchSize)

    await sql`
      INSERT INTO ${sql(table)} ${sql(batch, columns)}
    `

    process.stdout.write(`Loaded ${Math.min(i + batchSize, dataArray.length)} of ${dataArray.length} ${table}s\r`)
  }
}

const eventCount = events.length
const eventBatchSize = TX_BATCH_SIZE > 0 ? TX_BATCH_SIZE : eventCount

try {
  // Process data in batches
  for (let i = 0; i < events.length; i += eventBatchSize) {
    const eventBatch = events.slice(i, i + eventBatchSize)
    await sql.begin(async (sql) => {
      // Diabled FK checks
      await sql`SET CONSTRAINTS ALL DEFERRED`

      // Insert events
      const eventColumns = Object.keys(events[0])
      await batchInsert(sql, 'event', eventColumns, eventBatch, BATCH_SIZE)
    })

    if (eventBatchSize < events.length) {
      process.stdout.write(
        `Processed batch ${Math.floor(i / eventBatchSize) + 1}: ${Math.min(i + eventBatchSize, events.length)} of ${events.length} events\n`
      )
    }
  }
  console.info(`Loaded ${eventCount} events`)
} catch (error) {
  console.error('Error loading data: ', error)
  throw error
} finally {
  await sql.end()
}