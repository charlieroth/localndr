import { format, isToday } from 'date-fns'

import { Separator } from '@/components/ui/separator'
import { CalendarEvent } from '@/components/calendar-event'
import type { TimeFormat, Event } from '@/types'

interface DayRowProps {
  day: Date
  events: Event[]
  timeFormat: TimeFormat
}

export function DayRow({
  day,
  events,
  timeFormat,
}: DayRowProps) {
  const isCurrentDay = isToday(day)

  return (
    <div>
      {/* Day row */}
      <div className="flex gap-4 items-start">
        {/* Date circle */}
        <div
          className={`flex items-center justify-center size-8 shrink-0 rounded-md border-2 text-md ${
            isCurrentDay
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background'
          }`}
        >
          {format(day, 'd')}
        </div>

        {/* Day content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            <span className="font-medium">{format(day, 'EEEE')}</span>
            <span className="text-sm text-muted-foreground">
              {format(day, 'MMMM d, yyyy')}
            </span>
          </div>

          {/* Events */}
          <div className="mt-2 space-y-2">
            {events.length > 0 ? (
              [...events]
                .sort(
                  (a, b) =>
                    a.start_date.getTime() - b.start_date.getTime()
                )
                .map((event) => (
                  <CalendarEvent
                    key={event.id}
                    event={event}
                    timeFormat={timeFormat}
                  />
                ))
            ) : (
              <div className="py-2 px-4 rounded-lg border border-dashed border-border text-muted-foreground text-sm">
                No events scheduled
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator className="mt-4" />
    </div>
  )
}
