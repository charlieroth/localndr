import { isSameDay } from 'date-fns'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DayRow } from '@/components/day-row'
import type { Event } from '@/types'
import useCalendarStore from '@/stores/calendarStore'

interface DaysListProps {
  dates: Date[]
  events: Event[]
  onUpdateEvent: (updatedEvent: Event) => void
}

export function DaysList({
  dates,
  events,
}: DaysListProps) {
  const today = new Date()
  const { timeFormat } = useCalendarStore()

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-6 p-4 md:px-12 lg:px-24 md:max-w-4xl lg:max-w-6xl md:mx-auto">
        {dates.map((day) => {
          const dayEvents = events.filter((event) =>
            isSameDay(event.start_date, day)
          )
          const isToday = isSameDay(day, today)
          return (
            <div key={day.toString()} data-is-today={isToday}>
              <DayRow
                day={day}
                events={dayEvents}
                timeFormat={timeFormat}
              />
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
