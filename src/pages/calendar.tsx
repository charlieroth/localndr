import { useMemo, useState } from 'react'
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  subMonths,
  addMonths,
} from 'date-fns'
import { AddEventDialog } from '@/components/add-event-dialog'
import { DaysList } from '@/components/days-list'
import type { TimeFormat, Event, DBEvent } from '@/types'
import { useLoaderData } from 'react-router'
import { LiveQuery } from '@electric-sql/pglite/live'
import { Header } from '@/components/header'
import SettingsDialog from '@/components/settings-dialog'

export default function Calendar() {
  const { liveEvents } = useLoaderData() as { liveEvents: LiveQuery<DBEvent> }

  const [currentDate, setCurrentDate] = useState(new Date())
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('12h')

  // Get all days in the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  })

  const addEvent = (newEvent: Omit<Event, 'id'>) => {
    console.log('addEvent', newEvent)
    // setEvents([...events, { ...newEvent, id: events.length + 1 }])
  }

  const updateEvent = (updatedEvent: Event) => {
    console.log('updateEvent', updatedEvent)
    // setEvents(
    //   events.map((event) =>
    //     event.id === updatedEvent.id ? updatedEvent : event
    //   )
    // )
  }

  const calendarEvents: Event[] = useMemo(() => {
    if (!liveEvents) return []

    return liveEvents.initialResults.rows.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      start: new Date(event.start),
      end: new Date(event.end),
      created: new Date(event.created),
      modified: new Date(event.modified),
    }))
  }, [liveEvents])

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header
        dbConnected={true}
        isSyncing={false}
        currentDate={currentDate}
        handlePreviousMonth={() => {
          setCurrentDate(subMonths(currentDate, 1))
        }}
        handleNextMonth={() => {
          setCurrentDate(addMonths(currentDate, 1))
        }}
        setIsAddEventOpen={setIsAddEventOpen}
        setIsSettingsOpen={setIsSettingsOpen}
      />
      <main className="flex-1">
        <DaysList
          days={daysInMonth}
          events={calendarEvents}
          onUpdateEvent={updateEvent}
          timeFormat={timeFormat}
        />
        <AddEventDialog
          open={isAddEventOpen}
          onOpenChange={setIsAddEventOpen}
          onAddEvent={addEvent}
          currentDate={currentDate}
          timeFormat={timeFormat}
        />
        <SettingsDialog
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          timeFormat={timeFormat}
          setTimeFormat={setTimeFormat}
        />
      </main>
    </div>
  )
}
