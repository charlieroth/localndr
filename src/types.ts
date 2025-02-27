export type TimeFormat = '12h' | '24h'

export type Event = {
    id: number
    title: string
    description: string
    startDateTime: Date
    endDateTime: Date
}
