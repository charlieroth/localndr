import { useLiveQuery } from '@electric-sql/pglite-react'
import { LiveQuery } from '@electric-sql/pglite/live'
import { useLoaderData } from 'react-router'
import EventList from '../components/event-list'
import { Event } from '../types'
import { FilterState } from '../utils/filterState'
import Header from '@/components/header'

export default function List() {
  const { liveEvents, filterState } = useLoaderData() as {
    liveEvents: LiveQuery<Event>
    filterState: FilterState
  }
  const eventsRes = useLiveQuery(liveEvents)
  const events = eventsRes?.rows

  return (
    <div className="flex flex-col flex-grow">
      <Header filterState={filterState} />
      <EventList 
        dates={filterState.date ? [new Date(filterState.date)] : []}
        events={events} 
      />
    </div>
  )
}