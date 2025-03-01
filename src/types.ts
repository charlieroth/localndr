export type TimeFormat = '12h' | '24h'

export type DBEvent = {
  id: string
  title: string
  description: string
  start: string
  end: string
  created: string
  modified: string
}

export type Event = {
  id: string
  title: string
  description: string
  start: Date
  end: Date
  created: Date
  modified: Date
}
