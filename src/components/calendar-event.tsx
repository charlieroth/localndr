import { useState } from 'react'
import { format } from 'date-fns'
import { Clock } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ViewEventDialog } from '@/components/view-event-dialog'
import type { TimeFormat, Event } from '@/types'

interface CalendarEventProps {
  event: Event
  onUpdateEvent: (updatedEvent: Event) => void
  timeFormat: TimeFormat
}

export function CalendarEvent({
  event,
  onUpdateEvent,
  timeFormat,
}: CalendarEventProps) {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const now = new Date()
  const isCurrentEvent = now >= event.start_date && now <= event.end_date

  const timeFormatString = timeFormat === '12h' ? 'h:mm a' : 'HH:mm'

  return (
    <>
      <Card
        className={`overflow-hidden transition-colors cursor-pointer hover:bg-accent ${
          event.end_date < now ? 'opacity-50 hover:opacity-75 bg-muted' : ''
        } ${isCurrentEvent ? 'border-2 border-primary' : ''}`}
        onClick={() => setIsViewDialogOpen(true)}
      >
        <CardHeader>
          <CardTitle className="text-base">{event.title}</CardTitle>
          <CardDescription className="flex items-center gap-1 text-xs">
            <Clock className="size-3" />
            {format(event.start_date, timeFormatString)} -{' '}
            {format(event.end_date, timeFormatString)}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">{event.description}</CardContent>
      </Card>

      <ViewEventDialog
        event={event}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onUpdateEvent={onUpdateEvent}
        timeFormat={timeFormat}
      />
    </>
  )
}
