import { Event } from '@/types'
import { useLiveQuery } from '@electric-sql/pglite-react'
import { LiveQuery } from '@electric-sql/pglite/live'
import { useLoaderData } from 'react-router'


export default function Home() {
  const { liveEvents } = useLoaderData() as {
    liveEvents: LiveQuery<Event>
  }

  const eventsRes = useLiveQuery(liveEvents)

  return (
    <div>
      <h1>Home</h1>
      <pre>{JSON.stringify(eventsRes, null, 2)}</pre>
    </div>
  )
}
