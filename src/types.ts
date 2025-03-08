export type TimeFormat = '12h' | '24h'

export type Event = {
  id: string
  title: string
  description: string
  start_date: Date
  end_date: Date
  created: Date
  modified: Date
  deleted: boolean
  synced: boolean
}