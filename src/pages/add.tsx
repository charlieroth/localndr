import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useForm, SubmitHandler, Controller } from "react-hook-form"

type Inputs = {
  title: string
  description: string
  date: Date
  startTime: Date
  endTime: Date
}

export default function Add() {
  const now = new Date()
  const {
    register,
    handleSubmit,
    control
  } = useForm<Inputs>({
    defaultValues: {
      title: '',
      description: '',
      date: now,
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDay(), now.getHours(), 0, 0),
      endTime: new Date(now.getFullYear(), now.getMonth(), now.getDay(), now.getHours() + 1, 0, 0),
    }
  })

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header
        dbConnected={true}
        isSyncing={false}
      />
      <main className="flex flex-col items-center justify-center pt-10">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
          <h1>Add Event</h1>
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
          <div className="flex justify-end">
            <Button variant="outline" type="submit">
              Add
            </Button>
          </div>
        </form>
      </main>
    </div>

  )
}