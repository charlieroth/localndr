import { format } from 'date-fns'
import { Clock } from 'lucide-react'
import { useNavigate } from 'react-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { TimeFormat, Event } from '@/types'

interface CalendarEventProps {
  event: Event
  timeFormat: TimeFormat
}

export function CalendarEvent({
  event,
  timeFormat,
}: CalendarEventProps) {
  const navigate = useNavigate()
  const now = new Date()
  const isCurrentEvent = now >= event.start_date && now <= event.end_date

  const timeFormatString = timeFormat === '12h' ? 'h:mm a' : 'HH:mm'
  
  const handleClick = () => {
    navigate(`/e/${event.id}`)
  }

  return (
    <>
      <Card
        className={`overflow-hidden transition-colors cursor-pointer hover:bg-accent ${
          event.end_date < now ? 'opacity-50 hover:opacity-75 bg-muted' : ''
        } ${isCurrentEvent ? 'border-2 border-primary' : ''}`}
        onClick={handleClick}
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
    </>
  )
}
