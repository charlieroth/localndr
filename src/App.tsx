import { useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { PGliteWorker } from '@electric-sql/pglite/worker'
import { live, LiveNamespace } from '@electric-sql/pglite/live'
import { electricSync } from '@electric-sql/pglite-sync'
import { PGliteProvider } from '@electric-sql/pglite-react'
import PGWorker from './pglite-worker.js?worker'
import Calendar from './pages/calendar'
import { startSync, useSyncStatus, waitForInitialSyncDone } from './sync'
import { Header } from '@/components/header'
import { DBEvent } from './types'
import { ThemeProvider } from './components/theme-provider'

type PGliteWorkerWithLive = PGliteWorker & { live: LiveNamespace }

async function createPGlite() {
  return PGliteWorker.create(new PGWorker(), {
    extensions: {
      live,
      sync: electricSync(),
    },
  })
}

const pgPromise = createPGlite()

let syncStarted = false
pgPromise.then(async (pg) => {
  console.log('PGlite worker started')
  pg.onLeaderChange(() => {
    console.log('Leader changed', pg.isLeader)
    if (pg.isLeader && !syncStarted) {
      syncStarted = true
      startSync(pg)
    }
  })
})

async function eventsLoader({
  request,
}: {
  request: Request
}) {
  await waitForInitialSyncDone()
  const pg = await pgPromise
  const liveEvents = await pg.live.query<DBEvent>({
    query: `SELECT * FROM event`,
    signal: request.signal,
  })
  return { liveEvents }
}

const router = createBrowserRouter([
  {
    path: '/',
    index: true,
    element: <Calendar />,
    loader: eventsLoader,
  },
])

export default function App() {
  const [pgForProvider, setPgForProvider] = useState<PGliteWorkerWithLive | null>(null)
  const [syncStatus,] = useSyncStatus()

  useEffect(() => {
    pgPromise.then(setPgForProvider)
  }, [])

  if (!pgForProvider) {
    return <NoPGliteView />
  }

  if (syncStatus !== 'done') {
    return <SyncingView />
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <PGliteProvider db={pgForProvider}>
        <RouterProvider router={router} />
      </PGliteProvider>
    </ThemeProvider>
  )
}

const NoPGliteView = () => {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header
        dbConnected={false}
        isSyncing={false}
        currentDate={new Date()}
        handlePreviousMonth={() => {}}
        handleNextMonth={() => {}}
        setIsAddEventOpen={() => {}}
        setIsSettingsOpen={() => {}}
      />
      <main className="flex-1" />
    </div>
  )
}

const SyncingView = () => {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header
        dbConnected={true}
        isSyncing={true}
        currentDate={new Date()}
        handlePreviousMonth={() => {}}
        handleNextMonth={() => {}}
        setIsAddEventOpen={() => {}}
        setIsSettingsOpen={() => {}}
      />
      <main className="flex-1" />
    </div>
  )
}
