import { ChevronLeft, ChevronRight, CircleX, LoaderCircle, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { format } from "date-fns";

type HeaderProps = {
  isSyncing: boolean
  dbConnected: boolean
  currentDate: Date
  handlePreviousMonth: () => void
  handleNextMonth: () => void
  setIsAddEventOpen: (isOpen: boolean) => void
  setIsSettingsOpen: (isOpen: boolean) => void
}

export function Header({
  isSyncing,
  dbConnected,
  currentDate,
  handlePreviousMonth,
  handleNextMonth,
  setIsAddEventOpen,
  setIsSettingsOpen,
}: HeaderProps) {
  return (
    <header className="sticky top-0 border-b border-border bg-background p-4">
      <div className="flex items-center justify-between lg:justify-center lg:relative">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="size-4" />
          </Button>
          <h2 className="text-xl font-medium">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <div className="flex items-center gap-3 lg:absolute lg:right-0">
          {dbConnected && isSyncing && (
            <LoaderCircle className="size-4 animate-spin" />
          )}
          {!dbConnected && (
            <CircleX className="size-4 text-red-500" />
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsAddEventOpen(true)}
          >
            <Plus className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="size-4" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}