import { useState } from 'react'
import { format } from 'date-fns'
import { Clock, CalendarIcon, Pencil } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import type { TimeFormat, Event } from '@/types'

interface ViewEventDialogProps {
  event: Event
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateEvent: (updatedEvent: Event) => Promise<void>
  timeFormat: TimeFormat
}

export function ViewEventDialog({
  event,
  open,
  onOpenChange,
  onUpdateEvent,
  timeFormat,
}: ViewEventDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedEvent, setEditedEvent] = useState<Event>(event)

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedEvent({
      ...editedEvent,
      title: e.target.value,
    })
  }

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedEvent({
      ...editedEvent,
      description: e.target.value,
    })
  }

  const onCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const newStart = new Date(date)
      newStart.setHours(
        editedEvent.start_date.getHours(),
        editedEvent.start_date.getMinutes()
      )
      const newEnd = new Date(date)
      newEnd.setHours(
        editedEvent.end_date.getHours(),
        editedEvent.end_date.getMinutes()
      )
      setEditedEvent({
        ...editedEvent,
        start_date: newStart,
        end_date: newEnd,
      })
    }
  }
  
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number)
    const newStart = new Date(editedEvent.start_date)
    newStart.setHours(hours, minutes)
    setEditedEvent({
      ...editedEvent,
      start_date: newStart,
    })
  }

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number)
    const newEnd = new Date(editedEvent.end_date)
    newEnd.setHours(hours, minutes)
    setEditedEvent({
      ...editedEvent,
      end_date: newEnd,
    })
  }

  const handleSave = async () => {
    try {
      const now = new Date()
      await onUpdateEvent({
        ...editedEvent,
        modified: now,
      })
      setIsEditing(false)
    } catch (error) {
      console.error('view-event-dialog: Error saving event', error)
    }
  }

  const handleCancel = () => {
    setEditedEvent(event) // Reset to original event data
    setIsEditing(false)
  }

  const timeFormatString = timeFormat === '12h' ? 'h:mm a' : 'HH:mm'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-background text-foreground sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center space-y-0">
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="mr-2"
            >
              <Pencil className="size-4" />
            </Button>
          )}
          <DialogTitle>{isEditing ? 'Edit' : event.title}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isEditing ? (
            // Edit Mode
            <>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editedEvent.title}
                  onChange={onTitleChange}
                  placeholder="Event title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedEvent.description}
                  onChange={onDescriptionChange}
                  placeholder="Event description"
                />
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {format(editedEvent.start_date, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        className="rounded-md border"
                        mode="single"
                        selected={editedEvent.start_date}
                        onSelect={onCalendarSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={format(editedEvent.start_date, 'HH:mm')}
                      onChange={handleStartTimeChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={format(editedEvent.end_date, 'HH:mm')}
                      onChange={handleEndTimeChange}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            // View Mode
            <>
              <div className="grid gap-2">
                <Label>Description</Label>
                <div className="text-sm text-muted-foreground">
                  {event.description}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="size-4" />
                    {format(event.start_date, 'PPPP')}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Time</Label>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="size-4" />
                    {format(event.start_date, timeFormatString)} -{' '}
                    {format(event.end_date, timeFormatString)}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {isEditing && (
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
