import { Header } from './header'
import { Outlet } from 'react-router'

type LayoutProps = {
  isSyncing: boolean
  dbConnected?: boolean
}

export default function Layout({ dbConnected = true, isSyncing }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header
        dbConnected={dbConnected}
        isSyncing={isSyncing}
        currentDate={new Date()}
        handlePreviousMonth={() => {}}
        handleNextMonth={() => {}}
        setIsAddEventOpen={() => {}}
        setIsSettingsOpen={() => {}}
      />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
