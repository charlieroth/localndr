import { Outlet } from 'react-router'
import { Toaster } from "@/components/ui/sonner"

export default function Layout() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}
