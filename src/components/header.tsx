import { Calendar as CalendarIcon, DatabaseZap, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { format } from "date-fns";
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "react-router";
import { useEffect, useState } from "react";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { usePGlite } from "@electric-sql/pglite-react";
import { useFilterState } from "@/utils/filterState";
import { FilterState } from "@/utils/filterState";
import { createFTSIndex } from "@/migrations";

type HeaderProps = {
  showFiltering?: boolean
  filterState?: FilterState
}

export default function Header({ filterState, showFiltering = true }: HeaderProps) {
  const pg = usePGlite()
  const [usedFilterState, setFilterState] = useFilterState()
  // const [selectMode, setSelectMode] = useState<'single' | 'range'>('single')
  const [FTSIndexReady, setFTSIndexReady] = useState(true)

  filterState ??= usedFilterState

  const handleDateSelected = (date: Date | undefined) => {
    if (date) {
      setFilterState({
        ...filterState,
        date: format(date, 'yyyy-MM-dd')
      })
    }
  }

  useEffect(() => {
    const checkFTSIndex = async () => {
      const res = await pg.query(`SELECT 1 FROM pg_indexes WHERE indexname = 'event_search_idx';`)
      const indexReady = res.rows.length > 0
      if (!indexReady) {
        setFTSIndexReady(false)
        await createFTSIndex(pg)
      }
      setFTSIndexReady(true)
    }
    checkFTSIndex()
  }, [pg])

  const showFTSIndexProgress = !FTSIndexReady

  // const handleModeChange = (mode: string) => {
  //   setSelectMode(mode as 'single' | 'range')
  // }

  return (
    <header className="sticky top-0 border-b border-border bg-background p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={`/?date=${format(new Date(), 'yyyy-MM-dd')}`} className="flex items-center gap-2 hover:cursor-pointer hover:bg-muted py-2 px-4 rounded-md">
            <CalendarIcon className="size-6" />
            <p className="font-semibold text-xl">Localndr</p>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {showFiltering && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                variant="outline"
                className="w-full justify-start text-xl font-medium hover:cursor-pointer"
              >
                {filterState?.date ? `${format(filterState.date, 'PPP')}` : format(new Date(), 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  defaultMonth={new Date()}
                  selected={filterState?.date ? new Date(filterState.date) : undefined}
                  onSelect={handleDateSelected}
              />
              {/* <div className="flex items-center gap-2">
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
              </div> */}
              </PopoverContent>
            </Popover>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {showFTSIndexProgress && <DatabaseZap className="animate-pulse" />}
          </div>
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
