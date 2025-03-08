import { Event } from "../types";
import { CalendarEvent } from "./calendar-event";

type EventRowProps = {
  event: Event | undefined
}

export default function EventRow({ event }: EventRowProps) {
  if (!event?.id) {
    return (
      <div
        className="flex items-center flex-grow w-full min-w-0 pl-2 pr-8 text-sm border-b border-gray-100 hover:bg-gray-100 shrink-0"
      >
        <div className="w-full h-full" />
      </div>
    )
  }

  return (
    <CalendarEvent
      event={event}
      timeFormat="12h"
    />
  )
}