import { Hono } from 'hono'
import { cors } from 'hono/cors'
import postgres from 'postgres'
import { 
  ChangeSet,
  changeSetSchema,
  EventChange,
} from './src/utils/changes'
import { serve } from '@hono/node-server'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

// Create postgres connection
const sql = postgres(DATABASE_URL)

const app = new Hono()

async function applyChanges(changes: ChangeSet) {
  const { events } = changes
  await sql.begin(async (sql) => {
    for (const event of events) {
      await applyTableChanges('event', event, sql)
    }
  })
}

async function applyTableChanges(tableName: 'event', change: EventChange, sql: postgres.TransactionSql): Promise<void> {
  const {
    id,
    modified_columns: modified_columns_raw,
    new: isNew,
    deleted
  } = change
  const modified_columns = modified_columns_raw as (keyof typeof change)[]

  if (deleted) {
    await sql`
      DELETE FROM ${sql(tableName)} WHERE id = ${id}
    `
  } else if (isNew) {
    await sql`
      INSERT INTO ${sql(tableName)} ${sql(change, 'id', ...modified_columns)}
    `
  } else {
    await sql`
      UPDATE ${sql(tableName)}
      SET ${sql(change, ...modified_columns)}
      WHERE id = ${id}
    `
  }
}

// Middleware
app.use('/*', cors())

// Routes
app.get('/', async (c) => {
  const result = await sql`
    SELECT version() as postgres_version, now() as server_time
  `
  return c.json(result[0])
})

app.post('/apply-changes', async (c) => {
  const content = await c.req.json()

  let parsedChanges: ChangeSet
  try {
    parsedChanges = changeSetSchema.parse(content)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Invalid changes' }, 400)
  }

  try {
    await applyChanges(parsedChanges)
  } catch (error) {
    // TODO: Check which changes failed and save that and return that information to the client
    console.error(error)
    return c.json({ error: 'Failed to apply changes' }, 500)
  }

  return c.json({ success: true })
})

// Start the server
let port: string | number | undefined = process.env.SERVER_PORT
if (!port) {
  throw new Error('SERVER_PORT is not set')
}
port = Number(port)

console.log(`Server running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})

