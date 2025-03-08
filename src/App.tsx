import { useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { PGliteProvider } from '@electric-sql/pglite-react'
import { PGliteWorker } from '@electric-sql/pglite/worker'
import { ThemeProvider } from './components/theme-provider'
import { electricSync } from '@electric-sql/pglite-sync'
import { live, LiveNamespace } from '@electric-sql/pglite/live'
import PGWorker from './pglite-worker.js?worker'
import { startSync, useSyncStatus, waitForInitialSync } from './sync'
import Layout from './components/layout'
import {
  getFilterStateFromSearchParams,
  filterStateToSql,
} from './utils/filterState'
import { Event as EventType } from './types'
import List from './pages/list'
import Add from './pages/add'
import Settings from './pages/settings'
import Loading from './pages/loading'

type PGliteWorkerWithLive = PGliteWorker & { live: LiveNamespace }

async function createPGlite() {
  return PGliteWorker.create(new PGWorker(), {
    extensions: {
      live,
      sync: electricSync()
    }
  })
}

const pgPromise = createPGlite()

let syncStarted = false
pgPromise.then((pg) => {
  console.log('PGlite worker started')
  pg.onLeaderChange(() => {
    console.log('Leader changed')
    if (pg.isLeader && !syncStarted) {
      syncStarted = true
      startSync(pg)
    }
  })
})

async function eventListLoader({ request }: { request: Request }) {
  await waitForInitialSync()
  const pg = await pgPromise
  const url = new URL(request.url)
  const filterState = getFilterStateFromSearchParams(url.searchParams)
  const { sql, sqlParams } = filterStateToSql(filterState)
  const liveEvents = await pg.live.query<EventType>({
    query: sql,
    params: sqlParams,
    signal: request.signal,
    offset: 0,
    limit: 100
  })
  return { liveEvents, filterState }
}

// async function eventLoader({
//   params,
//   request
// }: {
//   params: Params,
//   request: Request
// }) {
//   const pg = await pgPromise
//   const liveEvent = await pg.live.query<EventType>({
//     query: `SELECT * FROM event WHERE id = $1`,
//     params: [params.id],
//     signal: request.signal
//   })
//   return { liveEvent }
// }

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <List />,
        loader: eventListLoader
      },
      {
        path: 'add',
        element: <Add />
      },
      {
        path: 'settings',
        element: <Settings />
      }
    ]
  }
])

export default function App() {
  const [pgForProivder, setPgForProvider] = useState<PGliteWorkerWithLive | null>(null)
  const [syncStatus, syncMessage] = useSyncStatus()

  useEffect(() => {
    pgPromise.then(setPgForProvider)
  }, [])

  if (!pgForProivder) {
    return (
      <Loading message="Starting PGlite..." />
    )
  }

  if (syncStatus === 'initial-sync') {
    return (
      <Loading message={syncMessage} />
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <PGliteProvider db={pgForProivder}>
        <RouterProvider router={router} />
      </PGliteProvider>
    </ThemeProvider>
  )
}