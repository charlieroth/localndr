import { useLiveQuery } from '@electric-sql/pglite-react'
import { LiveQuery } from '@electric-sql/pglite/live'
import { useLoaderData } from 'react-router'
import EventList from '../components/event-list'
import { Event } from '../types'
import { FilterState } from '../utils/filterState'
import Header from '@/components/header'
import { useMemo } from 'react'

export default function List() {
  const { liveEvents, filterState } = useLoaderData() as {
    liveEvents: LiveQuery<Event>
    filterState: FilterState
  }
  const eventsRes = useLiveQuery(liveEvents)
  const events = eventsRes?.rows

  const dates = useMemo(() => {
    if (filterState.view === 'day' && filterState.date) {
      return [new Date(filterState.date)]
    } else if (filterState.view === 'week' && filterState.startDate && filterState.endDate) {
      const startDate = new Date(filterState.startDate)
      const dates = []
      for (let i = 0; i < 7; i++) {
        dates.push(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i))
      }
      return dates
    } else if (filterState.view === 'month' && filterState.startDate && filterState.endDate) {
      const startDate = new Date(filterState.startDate)
      const dates = []
      for (let i = 0; i < 31; i++) {
        dates.push(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i))
      }
      return dates
    }

    return []
  }, [filterState])

  return (
    <div className="flex flex-col flex-grow">
      <Header filterState={filterState} />
      <EventList 
        dates={dates}
        events={events} 
      />
    </div>
  )
}