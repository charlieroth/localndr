import { isSameDay } from 'date-fns'

import { ScrollArea } from '@/components/ui/scroll-area'
import { DayRow } from '@/components/day-row'
import type { TimeFormat, Event } from '@/types'

interface DaysListProps {
    days: Date[]
    events: Event[]
    onUpdateEvent: (updatedEvent: Event) => void
    timeFormat: TimeFormat
}

export function DaysList({
    days,
    events,
    onUpdateEvent,
    timeFormat,
}: DaysListProps) {
    const today = new Date()

    return (
        <ScrollArea className="flex-1">
            <div className="flex flex-col gap-6 p-4 md:px-12 lg:px-24 md:max-w-4xl lg:max-w-6xl md:mx-auto">
                {days.map((day) => {
                    const dayEvents = events.filter((event) =>
                        isSameDay(event.startDateTime, day)
                    )
                    const isToday = isSameDay(day, today)
                    return (
                        <div key={day.toString()} data-is-today={isToday}>
                            <DayRow
                                day={day}
                                events={dayEvents}
                                onUpdateEvent={onUpdateEvent}
                                timeFormat={timeFormat}
                            />
                        </div>
                    )
                })}
            </div>
        </ScrollArea>
    )
}
