import { DaysList } from '@/components/days-list'
import { Header } from '@/components/header'
import { useLiveQuery } from '@/hooks/useDbQuery'
import { useDatabaseStore } from '@/stores/databaseStore'
import useCalendarStore from '@/stores/calendarStore'
import { DBEvent, Event } from '@/types'
import { convertDbEventsToEvents } from '@/utils/events'
import { format } from 'date-fns'

export default function Home() {
  const { syncStatus } = useDatabaseStore()
  const { currentDate } = useCalendarStore()
  
  // Format the current date as YYYY-MM-DD for SQL query using date-fns
  const formattedDate = format(currentDate, 'yyyy-MM-dd')
  
  const { data: dbEvents, isLoading, error } = useLiveQuery<DBEvent[]>(async (pg) => {
    // Use a direct SQL query with the date value embedded
    const query = `
      SELECT id, title, description, start_date, end_date, created, modified 
      FROM event
      WHERE DATE(start_date) = '${formattedDate}' OR DATE(end_date) = '${formattedDate}'
      ORDER BY start_date ASC
    `;
    
    const result = await pg.live.query<DBEvent>(query);
    
    return { 
      data: result.initialResults.rows ?? [],
      unsubscribe: result.unsubscribe
    };
  }, [formattedDate])
  
  // Convert DBEvents to Events with proper Date objects
  const events = dbEvents ? convertDbEventsToEvents(dbEvents) : []
  
  const handleUpdateEvent = (updatedEvent: Event) => {
    // Handle event updates here
    console.log('Update event', updatedEvent)
  }

  
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header
        dbConnected={syncStatus === 'ready'}
        isSyncing={syncStatus === 'syncing'}
      />
      <main className="flex-1">
        {error && (
          <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded m-4">
            Error loading events: {error.message}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading events...</p>
          </div>
        ) : (
          <DaysList
            events={events}
            onUpdateEvent={handleUpdateEvent}
          />
        )}
      </main>
    </div>
  )
}
