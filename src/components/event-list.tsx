import { Event } from '../types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { isSameDay } from 'date-fns'
import { DayRow } from './day-row'
import useCalendarStore from '@/stores/calendarStore'
import { Separator } from './ui/separator'

type EventListProps = {
  dates: Date[]
  events: Event[]
}

export default function EventList({ dates, events }: EventListProps) {
  const today = new Date()
  const { timeFormat } = useCalendarStore()

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-6 p-4 md:px-12 lg:px-24 md:max-w-4xl lg:max-w-6xl md:mx-auto">
        {dates.map((day) => {
          const dayEvents = events.filter((event) => isSameDay(event.start_date, day))
          const isToday = isSameDay(day, today)
          return (
            <>
              <div key={`day-events-${day.toString()}`} data-is-today={isToday}>
                <DayRow
                  day={day}
                  events={dayEvents}
                  timeFormat={timeFormat}
                />
              </div>
              {dates.length > 1 && <Separator className="mt-4" />}
            </>
          )
        })}
      </div>
    </ScrollArea>
  )
}