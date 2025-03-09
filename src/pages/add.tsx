import { toast } from "sonner";
import { format } from "date-fns";
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { v4 as uuidv4 } from 'uuid'
import { usePGlite } from "@electric-sql/pglite-react";
import { useNavigate } from "react-router";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

type Inputs = {
  title: string
  description: string
  date: Date
  startTime: string
  endTime: string
}

export default function Add() {
  const navigate = useNavigate()
  const pg = usePGlite()
  const now = new Date()
  const {
    register,
    handleSubmit,
    control,
    reset,
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

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    try {
      const [startHour, startMinutes] = values.startTime.split(":").map(Number)
      const [endHour, endMinutes] = values.endTime.split(":").map(Number)
      const startDate = new Date(values.date)
      startDate.setHours(startHour, startMinutes, 0, 0)
      const endDate = new Date(values.date)
      endDate.setHours(endHour, endMinutes, 0, 0)
      const eventId = uuidv4()
      
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

      toast.success("Event created", {
        description: "Calendar event created successfully",
      })

      navigate(`/?date=${format(values.date, 'yyyy-MM-dd')}`)
      
      reset({
        title: '',
        description: '',
        date: now,
        startTime: `${now.getHours()}:00`,
        endTime: `${now.getHours() + 1}:00`,
      })
    } catch {
      toast.error("Error creating event", {
        description: "Please try again",
      })
    }
  }

  return (
    <>
      <Header showFiltering={false} />
      <main className="flex-1 ">
        <div className="flex flex-col items-center justify-center pt-10">
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
        </div>
      </main>
    </>
  )
}