export type TimeFormat = '12h' | '24h'

export type DBEvent = {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  created: string
  modified: string
}

export type Event = {
  id: string
  title: string
  description: string
  start_date: Date
  end_date: Date
  created: Date
  modified: Date
}
