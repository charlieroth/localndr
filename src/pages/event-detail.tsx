import { useParams, useNavigate } from 'react-router'
import { format } from 'date-fns'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'

import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDbQuery } from '@/hooks/useDbQuery'
import { DBEvent } from '@/types'
import { convertDbEventToEvent } from '@/utils/events'

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  
  const { data: dbEvent, isLoading, error } = useDbQuery<DBEvent | null>(
    async (pg) => {
      if (!eventId) return null
      
      const result = await pg.query<DBEvent>(`
        SELECT id, title, description, start_date, end_date, created, modified 
        FROM event
        WHERE id = $1
      `, [eventId])
      
      return result.rows.length > 0 ? result.rows[0] : null
    },
    [eventId]
  )
  
  const event = dbEvent ? convertDbEventToEvent(dbEvent) : null
  
  const handleBack = () => {
    navigate('/')
  }
  
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header dbConnected={true} isSyncing={false} />
      <main className="flex-1 container max-w-3xl mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0 flex items-center gap-2 hover:cursor-pointer"
          onClick={handleBack}
        >
          <ArrowLeft size={16} />
          Back to Calendar
        </Button>
        
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}
        
        {error && (
          <div className="p-4 border border-destructive rounded-md text-destructive">
            <h2 className="text-lg font-semibold">Error Loading Event</h2>
            <p>{error.message}</p>
          </div>
        )}
        
        {event && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{format(event.start_date, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>
                    {format(event.start_date, 'h:mm a')} - {format(event.end_date, 'h:mm a')}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                  <p className="whitespace-pre-wrap">{event.description}</p>
                </div>
                <div className="flex flex-col gap-2 pt-4 border-t text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <p>Created:</p>
                    <pre className="font-medium text-foreground">{format(event.created, 'yyyy-MM-dd HH:mm')}</pre>
                  </div>
                  <div className="flex items-center gap-2">
                    <p>Last Modified:</p>
                    <pre className="font-medium text-foreground">{format(event.modified, 'yyyy-MM-dd HH:mm')}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!isLoading && !error && !event && (
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Event Not Found</h2>
            <p className="text-muted-foreground">The event you're looking for doesn't exist or has been deleted.</p>
            <Button className="mt-4" onClick={handleBack}>
              Return to Calendar
            </Button>
          </div>
        )}
      </main>
    </div>
  )
} 