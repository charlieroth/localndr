import { create } from 'zustand'
import { CalendarStoreFilter, CalendarView, TimeFormat } from '@/types'
import { format } from 'date-fns'

type State = {
  filter: CalendarStoreFilter
  timeFormat: TimeFormat
}

type Action = {
  setFilter: (searchParams: URLSearchParams) => void
  setTimeFormat: (timeFormat: TimeFormat) => void
}

const useCalendarStore = create<State & Action>()((set) => ({
  filter: {
    date: format(new Date(), 'yyyy-MM-dd'),
    view: 'DAY'
  },
  timeFormat: '12h',
  setFilter: (searchParams: URLSearchParams) => set(() => {
    const date = searchParams.get('date') ?? format(new Date(), 'yyyy-MM-dd')
    const view = (searchParams.get('view') ?? 'DAY') as CalendarView
    return { filter: { date, view } }
  }),
  setTimeFormat: (timeFormat: TimeFormat) => set({ timeFormat })
}))

export default useCalendarStore
