import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { PGliteProvider } from '@electric-sql/pglite-react'
import Home from './pages/home'
import { ThemeProvider } from './components/theme-provider'
import Add from './pages/add'
import Settings from './pages/settings'
import { useDatabaseStore } from './stores/databaseStore'

export default function App() {
  const { pg, syncStatus, syncMessage, initialize } = useDatabaseStore()
  
  // Initialize the database on app start
  useEffect(() => {
    initialize()
  }, [initialize])

  if (!pg) {
    return <NoPGliteView message="Initializing PGlite..." />
  }

  if (syncStatus !== 'ready') {
    return <SyncingView message={syncMessage} />
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <PGliteProvider db={pg}>
        <BrowserRouter>
          <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/add" element={<Add />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </BrowserRouter>
      </PGliteProvider>
    </ThemeProvider>
  )
}

const NoPGliteView = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Database Not Available</h2>
          <p>{message}</p>
        </div>
      </main>
    </div>
  )
}

const SyncingView = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Synchronizing Database</h2>
          <p>{message}</p>
        </div>
      </main>
    </div>
  )
}
