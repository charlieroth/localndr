import { Calendar as CalendarIcon, CircleX, LoaderCircle, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { format } from "date-fns";
import useCalendarStore from "@/stores/calendarStore";
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "react-router";
import { DateRange, SelectRangeEventHandler, SelectSingleEventHandler } from "react-day-picker";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

type HeaderProps = {
  isSyncing: boolean
  dbConnected: boolean
}

export function Header({
  isSyncing,
  dbConnected,
}: HeaderProps) {
  const [selectMode, setSelectMode] = useState<'single' | 'range'>('single')
  const { currentDate, setCurrentDate, currentDateRange, setCurrentDateRange } = useCalendarStore()

  const handleModeChange = (mode: string) => {
    setSelectMode(mode as 'single' | 'range')
  }

  const handleSelectSingle: SelectSingleEventHandler = (
    day: Date | undefined,
  ) => {
    if (day) {
      setCurrentDate(day)
    }
  }

  const handleSelectRange: SelectRangeEventHandler = (range: DateRange | undefined) => {
    if (range) {
      setCurrentDateRange(range)
    }
  }

  return (
    <header className="sticky top-0 border-b border-border bg-background p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 hover:cursor-pointer hover:bg-muted py-2 px-4 rounded-md">
            <CalendarIcon className="size-6" />
            <p className="font-semibold text-xl">Localndr</p>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-xl font-medium hover:cursor-pointer"
              >
                {currentDateRange ? `${format(currentDateRange.from!, 'PPP')} - ${format(currentDateRange.to!, 'PPP')}` : format(currentDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              {selectMode === 'single' ? (
                <Calendar
                  mode="single"
                  defaultMonth={currentDate}
                  selected={currentDate}
                  onSelect={handleSelectSingle}
              />
              ) : (
                <Calendar
                  mode="range"
                  defaultMonth={currentDate}
                  onSelect={handleSelectRange}
                  selected={currentDateRange!}
                />
              )}
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Mode</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Select Mode</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={selectMode} onValueChange={handleModeChange}>
                      <DropdownMenuRadioItem value="single">Single</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="range">Range</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-3">
          {dbConnected && isSyncing && (
            <LoaderCircle className="size-4 animate-spin" />
          )}
          {!dbConnected && (
            <CircleX className="size-4 text-red-500" />
          )}
          <Link to="/add">
            <Button
              variant="outline"
              size="icon"
              className="hover:cursor-pointer"
            >
              <Plus className="size-4" />
            </Button>
          </Link>
          <Link to="/settings">
            <Button
              variant="outline"
              size="icon"
              className="hover:cursor-pointer"
            >
              <Settings className="size-4" />
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}