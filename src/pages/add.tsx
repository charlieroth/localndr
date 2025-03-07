import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { useDatabaseStore } from '@/stores/databaseStore'
import { useNavigate } from 'react-router'
import { v4 as uuidv4 } from 'uuid'

type Inputs = {
  title: string
  description: string
  date: Date
  startTime: string
  endTime: string
}

export default function Add() {
  const now = new Date()
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting}
  } = useForm<Inputs>({
    defaultValues: {
      title: '',
      description: '',
      date: now,
      startTime: `${now.getHours()}:00`,
      endTime: `${now.getHours() + 1}:00`,
    }
  })
  const { withDatabase } = useDatabaseStore()
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    try {
      console.log('values: ', values)
      const [startHour, startMinutes] = values.startTime.split(":").map(Number)
      const [endHour, endMinutes] = values.endTime.split(":").map(Number)
      // Create start_date by combining date and startTime
      const startDate = new Date(values.date)
      startDate.setHours(
        startHour,
        startMinutes,
        0,
        0
      )
      
      // Create end_date by combining date and endTime
      const endDate = new Date(values.date)
      endDate.setHours(
        endHour,
        endMinutes,
        0,
        0
      )

      console.log({
        date: values.date,
        title: values.title,
        description: values.description,
        startDate,
        endDate
      })
      
      // Generate a UUID for the new event
      const eventId = uuidv4()
      
      // Insert the event into the database
      await withDatabase(async (pg) => {
        await pg.query(`
          INSERT INTO event (
            id, 
            title, 
            description, 
            start_date, 
            end_date, 
            created, 
            modified
          ) VALUES (
            $1, 
            $2, 
            $3, 
            $4, 
            $5, 
            NOW(), 
            NOW()
          )
        `, [
          eventId,
          values.title,
          values.description,
          startDate.toISOString(),
          endDate.toISOString()
        ])
      })
      
      // Navigate back to the home page after successful submission
      navigate('/')
    } catch (error) {
      console.error('Error creating event:', error)
      // You could add error handling UI here
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header
        dbConnected={true}
        isSyncing={false}
      />
      <main className="flex flex-col items-center justify-center pt-10">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
          <h1 className="text-2xl font-bold">Add Event</h1>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Event title"
                {...register('title', { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Event description"
                {...register('description', { required: true })}
              />
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Date</Label>
                <Popover>
                  <Controller
                    control={control}
                    name="date"
                    render={({ field: { value, onChange} }) => {
                      console.log(value)
                      return (
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
                          <Calendar
                            className="rounded-md border"
                            mode="single"
                            selected={value}
                            onSelect={(date) => onChange(date)}
                            initialFocus
                          />
                          </PopoverContent>
                        </>
                      )
                    }}
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
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    {...register('endTime', { required: true })}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}