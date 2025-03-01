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
import { usePGlite } from '@electric-sql/pglite-react'

export default function Calendar() {
  const { liveEvents } = useLoaderData() as { liveEvents: LiveQuery<DBEvent> }
  const db = usePGlite()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('12h')

  // Get all days in the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  })

  const addEvent = async (newEvent: Event): Promise<void> => {
    try {
      await db.query(`
        INSERT INTO event (id, title, description, start_date, end_date, created, modified)
        VALUES (
          '${newEvent.id}',
          '${newEvent.title}',
          '${newEvent.description}',
          '${newEvent.start_date.toISOString()}',
          '${newEvent.end_date.toISOString()}',
          '${newEvent.created.toISOString()}',
          '${newEvent.modified.toISOString()}'
        );
      `)
    } catch (error) {
      console.error('calendar: Error adding event', error)
    }
  }

  const updateEvent = async (updatedEvent: Event) => {
    try {
      await db.query(`
        UPDATE event 
        SET 
          title = '${updatedEvent.title}',
          description = '${updatedEvent.description}',
          start_date = '${updatedEvent.start_date.toISOString()}',
          end_date = '${updatedEvent.end_date.toISOString()}',
          modified = '${updatedEvent.modified.toISOString()}'
        WHERE id = '${updatedEvent.id}'
      `)
    } catch (error) {
      console.error('calendar: Error updating event', error)
    }
  }

  const calendarEvents: Event[] = useMemo(() => {
    if (!liveEvents) return []

    return liveEvents.initialResults.rows.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      start_date: new Date(event.start_date),
      end_date: new Date(event.end_date),
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
