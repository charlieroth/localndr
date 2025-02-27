import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Settings } from 'lucide-react'
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
} from 'date-fns'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { AddEventDialog } from '@/components/add-event-dialog'
import { ThemeToggle } from '@/components/theme-toggle'
import { DaysList } from '@/components/days-list'
import { initialEvents } from '@/data/events'
import type { TimeFormat, Event } from '@/types'

export default function App() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [events, setEvents] = useState(initialEvents)
    const [isAddEventOpen, setIsAddEventOpen] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [timeFormat, setTimeFormat] = useState<TimeFormat>('12h')

    // Get all days in the current month
    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    })

    const handlePreviousMonth = () => {
        setCurrentDate(subMonths(currentDate, 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1))
    }

    const addEvent = (newEvent: Omit<Event, 'id'>) => {
        setEvents([...events, { ...newEvent, id: events.length + 1 }])
    }

    const updateEvent = (updatedEvent: Event) => {
        setEvents(
            events.map((event) =>
                event.id === updatedEvent.id ? updatedEvent : event
            )
        )
    }

    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            <header className="sticky top-0 border-b border-border bg-background p-4">
                <div className="flex items-center justify-between lg:justify-center lg:relative">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePreviousMonth}
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <h2 className="text-xl font-medium">
                            {format(currentDate, 'MMMM yyyy')}
                        </h2>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleNextMonth}
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-3 lg:absolute lg:right-0">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsAddEventOpen(true)}
                        >
                            <Plus className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsSettingsOpen(true)}
                        >
                            <Settings className="size-4" />
                        </Button>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <DaysList
                days={daysInMonth}
                events={events}
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

            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogContent className="border-border bg-background text-foreground sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Settings</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Time Format</Label>
                            <RadioGroup
                                value={timeFormat}
                                onValueChange={(value) =>
                                    setTimeFormat(value as TimeFormat)
                                }
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="12h" id="12h" />
                                    <Label htmlFor="12h">
                                        12-hour (1:00 PM)
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="24h" id="24h" />
                                    <Label htmlFor="24h">24-hour (13:00)</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
