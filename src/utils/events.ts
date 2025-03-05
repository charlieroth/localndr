import { DBEvent, Event } from '../types'

/**
 * Converts a DBEvent with string dates to an Event with proper Date objects
 */
export function convertDbEventToEvent(dbEvent: DBEvent): Event {
  return {
    ...dbEvent,
    start_date: new Date(dbEvent.start_date),
    end_date: new Date(dbEvent.end_date),
    created: new Date(dbEvent.created),
    modified: new Date(dbEvent.modified),
  }
}

/**
 * Converts an array of DBEvents to Events
 */
export function convertDbEventsToEvents(dbEvents: DBEvent[]): Event[] {
  return dbEvents.map(convertDbEventToEvent)
} 