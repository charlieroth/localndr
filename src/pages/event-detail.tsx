import { useParams, useNavigate } from 'react-router'
import { format } from 'date-fns'
import { ArrowLeft, Clock, Calendar, Pencil } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'

import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useDatabaseStore } from '@/stores/databaseStore'
import { useDbQuery } from '@/hooks/useDbQuery'
import { DBEvent } from '@/types'
import { convertDbEventToEvent } from '@/utils/events'

type EventFormInputs = {
  title: string
  description: string
  date: Date
  startTime: string
  endTime: string
}

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  
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
  
  const event = useMemo(() => {
    if (!dbEvent) return null
    return convertDbEventToEvent(dbEvent)
  }, [dbEvent])
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<EventFormInputs>({ 
    defaultValues: async () => {
      const dbEvent = await useDatabaseStore.getState().withDatabase(async (pg) => {
        const result = await pg.query<DBEvent>(`
          SELECT id, title, description, start_date, end_date, created, modified 
          FROM event
          WHERE id = $1
        `, [eventId])
        
        return result.rows.length > 0 ? result.rows[0] : null
      }) 

      if (!dbEvent) {
        return {
          title: '',
          description: '',
          date: new Date(),
          startTime: '',
          endTime: ''
        }
      }

      const event = convertDbEventToEvent(dbEvent)
      return {
        title: event.title,
        description: event.description,
        date: event.start_date,
        startTime: format(event.start_date, 'HH:mm'),
        endTime: format(event.end_date, 'HH:mm')
      }
    }
  })
  
  // Initialize form when event data is loaded
  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        date: event.start_date,
        startTime: format(event.start_date, 'HH:mm'),
        endTime: format(event.end_date, 'HH:mm')
      })
    }
  }, [reset, event])
  
  const handleBack = () => {
    navigate('/')
  }
  
  const handleEdit = () => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        date: event.start_date,
        startTime: format(event.start_date, 'HH:mm'),
        endTime: format(event.end_date, 'HH:mm')
      })
      setIsEditing(true)
    }
  }
  
  const handleCancel = () => {
    setIsEditing(false)
  }
  
  const onSubmit: SubmitHandler<EventFormInputs> = async (data) => {
    if (!eventId || !event) return
    
    try {
      const [startHour, startMinutes] = data.startTime.split(":").map(Number)
      const [endHour, endMinutes] = data.endTime.split(":").map(Number)
      
      // Create start_date by combining date and startTime
      const startDate = new Date(data.date)
      startDate.setHours(
        startHour,
        startMinutes,
        0,
        0
      )
      
      // Create end_date by combining date and endTime
      const endDate = new Date(data.date)
      endDate.setHours(
        endHour,
        endMinutes,
        0,
        0
      )
      
      // Update the event in the database
      await useDatabaseStore.getState().withDatabase(async (pg) => {
        await pg.query(`
          UPDATE event
          SET 
            title = $1,
            description = $2,
            start_date = $3,
            end_date = $4,
            modified = NOW(),
            new = false
          WHERE id = $5
        `, [
          data.title,
          data.description,
          startDate.toISOString(),
          endDate.toISOString(),
          eventId
        ])
      })
      
      // Exit edit mode
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating event:', error)
    }
  }
  
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header dbConnected={true} isSyncing={false} />
      <main className="flex-1 container max-w-3xl mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0 flex items-center gap-2"
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
        
        {event && !isEditing && (
          <Card className="shadow-md relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4"
              onClick={handleEdit}
            >
              <Pencil size={16} />
            </Button>
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
        
        {event && isEditing && (
          <Card className="shadow-md">
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="text-xl">Edit Event</CardTitle>
              </CardHeader>
              <CardContent className="mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Event title"
                      {...register('title', { required: true })}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">Title is required</p>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Event description"
                      className="min-h-[100px]"
                      {...register('description')}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Date</Label>
                    <Popover>
                      <Controller
                        control={control}
                        name="date"
                        render={({ field: { value, onChange } }) => (
                          <>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                {format(value, 'PPP')}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="center">
                              <CalendarComponent
                                className="rounded-md border"
                                mode="single"
                                selected={value}
                                onSelect={(date) => onChange(date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </>
                        )}
                      />
                    </Popover>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        {...register('startTime', { required: true })}
                      />
                      {errors.startTime && (
                        <p className="text-sm text-destructive">Start time is required</p>
                      )}
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        {...register('endTime', { required: true })}
                      />
                      {errors.endTime && (
                        <p className="text-sm text-destructive">End time is required</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  variant="outline"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </CardFooter>
            </form>
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