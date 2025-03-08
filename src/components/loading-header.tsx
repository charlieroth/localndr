import { CalendarIcon, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoadingHeader() {
  return (
    <header className="sticky top-0 border-b border-border bg-background p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 hover:cursor-pointer hover:bg-muted py-2 px-4 rounded-md">
            <CalendarIcon className="size-6" />
            <p className="font-semibold text-xl">Localndr</p>
          </div>
        </div>
        <div className="flex" />
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="hover:cursor-pointer"
          >
            <Plus className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hover:cursor-pointer"
          >
            <Settings className="size-4" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>

  )
}