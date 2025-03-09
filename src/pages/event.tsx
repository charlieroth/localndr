import Header from "@/components/header"
import { useLiveQuery } from "@electric-sql/pglite-react"
import { LiveQuery } from "@electric-sql/pglite/live"
import { useLoaderData } from "react-router"
import { Event as EventType } from "@/types"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Calendar } from "lucide-react"

export default function Event() {
  const { liveEvent } = useLoaderData() as {
    liveEvent: LiveQuery<EventType>
  }
  const eventRes = useLiveQuery(liveEvent)
  const event = eventRes?.rows[0]

  return (
    <>
      <Header showFiltering={false} />
      <main className="flex-1">
        <div className="flex flex-col gap-6 p-4 md:px-12 lg:px-24 md:max-w-4xl lg:max-w-6xl md:mx-auto">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{format(event.start_date, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>
                  {format(event.start_date, 'h:mm a')} - {format(event.end_date, 'h:mm a')}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                <p className="whitespace-pre-wrap">{event.description}</p>
              </div>
              <div className="flex flex-col gap-2 pt-4 border-t text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <p>Created:</p>
                  <pre className="font-medium text-foreground">{format(event.created, 'yyyy-MM-dd HH:mm')}</pre>
                </div>
                <div className="flex items-center gap-2">
                  <p>Last Modified:</p>
                  <pre className="font-medium text-foreground">{format(event.modified, 'yyyy-MM-dd HH:mm')}</pre>
                </div>
              </div>
            </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}