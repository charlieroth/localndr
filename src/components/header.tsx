import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, DatabaseZap, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addDays, addMonths, format, getWeek, startOfMonth, startOfWeek, subDays, subMonths } from "date-fns";
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { usePGlite } from "@electric-sql/pglite-react";
import { useFilterState } from "@/utils/filterState";
import { FilterState } from "@/utils/filterState";
import { createFTSIndex } from "@/migrations";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { CalendarView } from "@/types";

type HeaderProps = {
  showFiltering?: boolean
  filterState?: FilterState
}

export default function Header({ filterState, showFiltering = true }: HeaderProps) {
  const pg = usePGlite()
  const [usedFilterState, setFilterState] = useFilterState()
  const [FTSIndexReady, setFTSIndexReady] = useState(true)

  filterState ??= usedFilterState
  
  useEffect(() => {
    if (filterState.view !== undefined) return

    setFilterState({
      view: 'day',
      date: format(new Date(), 'yyyy-MM-dd'),
    })
  }, [filterState, setFilterState])

  const handleDateSelected = (date: Date | undefined) => {
    if (date) {
      setFilterState({
        view: 'day',
        date: format(date, 'yyyy-MM-dd'),
        startDate: undefined,
        endDate: undefined,
      })
    }
  }

  const handleNextClicked = () => {
    if (filterState?.view === 'day' && filterState?.date) {
      const nextDate = addDays(new Date(filterState.date), 1)
      setFilterState({
        view: 'day',
        date: format(nextDate, 'yyyy-MM-dd'),
        startDate: undefined,
        endDate: undefined,
      })
    } else if (filterState?.view === 'week' && filterState?.startDate && filterState?.endDate) {
      const nextWeekStartDate = addDays(new Date(filterState.startDate), 7)
      const nextWeekEndDate = addDays(new Date(filterState.endDate), 7)
      setFilterState({
        view: 'week',
        date: undefined,
        startDate: format(nextWeekStartDate, 'yyyy-MM-dd'),
        endDate: format(nextWeekEndDate, 'yyyy-MM-dd'),
      })
    } else if (filterState?.view === 'month' && filterState?.startDate && filterState?.endDate) {
      const nextMonthStartDate = addMonths(new Date(filterState.startDate), 1)
      const nextMonthEndDate = addMonths(new Date(filterState.endDate), 1)
      setFilterState({
        view: 'month',
        date: undefined,
        startDate: format(nextMonthStartDate, 'yyyy-MM-dd'),
        endDate: format(nextMonthEndDate, 'yyyy-MM-dd'),
      })
    }
  }

  const handlePreviousClicked = () => {
    if (filterState?.view === 'day' && filterState?.date) {
      const previousDate = subDays(new Date(filterState.date), 1)
      setFilterState({
        view: 'day',
        date: format(previousDate, 'yyyy-MM-dd'),
        startDate: undefined,
        endDate: undefined,
      })
    } else if (filterState?.view === 'week' && filterState?.startDate && filterState?.endDate) {
      const previousWeekStartDate = subDays(new Date(filterState.startDate), 7)
      const previousWeekEndDate = subDays(new Date(filterState.endDate), 7)
      setFilterState({
        view: 'week',
        date: undefined,
        startDate: format(previousWeekStartDate, 'yyyy-MM-dd'),
        endDate: format(previousWeekEndDate, 'yyyy-MM-dd'),
      })
    } else if (filterState?.view === 'month' && filterState?.startDate && filterState?.endDate) {
      const previousMonthStartDate = subMonths(new Date(filterState.startDate), 1)
      const previousMonthEndDate = subMonths(new Date(filterState.endDate), 1)
      setFilterState({
        view: 'month',
        date: undefined,
        startDate: format(previousMonthStartDate, 'yyyy-MM-dd'),
        endDate: format(previousMonthEndDate, 'yyyy-MM-dd'),
      })
    }
  }

  const handleCalendarViewChanage = (view: string) => {
    if (view === 'day') {
      setFilterState({
        view: view as CalendarView,
        date: format(new Date(), 'yyyy-MM-dd'),
        startDate: undefined,
        endDate: undefined,
      })
    } else if (view === 'week') {
      const currentDate = filterState.date ? new Date(filterState.date) : new Date()
      const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 })
      const endOfWeekDate = addDays(startOfWeekDate, 6)
      setFilterState({
        view: view as CalendarView,
        date: undefined,
        startDate: format(startOfWeekDate, 'yyyy-MM-dd'),
        endDate: format(endOfWeekDate, 'yyyy-MM-dd')
      })
    } else if (view === 'month') {
      const currentDate = filterState.date ? new Date(filterState.date) : new Date()
      const startOfMonthDate = startOfMonth(currentDate)
      const endOfMonthDate = addMonths(startOfMonthDate, 1)
      setFilterState({
        view: view as CalendarView,
        date: undefined,
        startDate: format(startOfMonthDate, 'yyyy-MM-dd'),
        endDate: format(endOfMonthDate, 'yyyy-MM-dd')
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

  return (
    <header className="sticky top-0 border-b border-border bg-background p-4 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={`/?view=day&date=${format(new Date(), 'yyyy-MM-dd')}`} className="flex items-center gap-2 hover:cursor-pointer hover:bg-muted py-2 px-4 rounded-md">
            <CalendarIcon className="size-6" />
            <p className="font-semibold text-xl">Localndr</p>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {showFiltering && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="text-xl font-semibold hover:cursor-pointer">
                    {filterState?.view ? filterState.view.charAt(0).toUpperCase() + filterState.view.slice(1) : 'Day'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleCalendarViewChanage('day')}>Day</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCalendarViewChanage('week')}>Week</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCalendarViewChanage('month')}>Month</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {filterState?.view === 'day' && filterState?.date ? (
                <DayCalendarDateButton date={new Date(filterState.date)} handleDateSelected={handleDateSelected} />
              ) : filterState?.view === 'week' && filterState?.startDate ? (
                <WeekCalendarDateButton startDate={new Date(filterState.startDate)} />
              ) : filterState?.view === 'month' && filterState?.startDate ? (
                <MonthCalendarDateButton startDate={new Date(filterState.startDate)} />
              ) : (
                <DayCalendarDateButton date={new Date()} handleDateSelected={handleDateSelected} />
              )}
              <Button size="icon" variant="outline" className="hover:cursor-pointer" onClick={handlePreviousClicked}>
                <ChevronLeft />
              </Button>
              <Button size="icon" variant="outline" className="hover:cursor-pointer" onClick={handleNextClicked}>
                <ChevronRight />
              </Button>
            </>
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
        </div>
      </div>
    </header>
  )
}

type DayCalendarDateButtonProps = {
  date: Date
  handleDateSelected: (date: Date | undefined) => void
}

const DayCalendarDateButton = ({ date, handleDateSelected }: DayCalendarDateButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="text-xl font-semibold hover:cursor-pointer"
        >
          {format(date, 'PPP')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={handleDateSelected}
        />
      </PopoverContent>
    </Popover>
  )
}

const WeekCalendarDateButton = ({ startDate }: { startDate: Date }) => {
  const weekNumber = getWeek(new Date(startDate))
  const currentYear = new Date(startDate).getFullYear()
  return (
    <Button
      type="button"
      variant="outline"
      className="text-xl font-semibold hover:cursor-pointer"
    >
      {`W${weekNumber} ${currentYear}`}
    </Button>
  )
}

const MonthCalendarDateButton = ({ startDate }: { startDate: Date }) => {
  const monthName = format(new Date(startDate), 'MMMM')
  const currentYear = new Date(startDate).getFullYear()
  return (
    <Button
      type="button"
      variant="outline"
      className="text-xl font-semibold hover:cursor-pointer"
    >
      {monthName} {currentYear}
    </Button>
  )
}