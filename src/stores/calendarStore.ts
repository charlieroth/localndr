import { create } from 'zustand'
import { TimeFormat } from '@/types'
import type { DateRange } from 'react-day-picker'

type State = {
  timeFormat: TimeFormat
  currentDate: Date
  currentDateRange: DateRange | null
  day: Date | null
  month: number | null
  year: number | null
}

type Action = {
  setCurrentDate: (date: Date) => void
  setCurrentDateRange: (dateRange: DateRange | null) => void
  setDay: (day: Date) => void
  setMonth: (month: number) => void
  setYear: (year: number) => void
  setTimeFormat: (timeFormat: TimeFormat) => void
}

const useCalendarStore = create<State & Action>()((set) => ({
  timeFormat: '12h',
  currentDate: new Date(),
  currentDateRange: null,
  day: null,
  month: null,
  year: null,
  setCurrentDate: (date: Date) => set({ currentDate: date }),
  setCurrentDateRange: (dateRange: DateRange | null) => set({ currentDateRange: dateRange }),
  setDay: (day: Date) => set({ day }),
  setMonth: (month: number) => set({ month }),
  setYear: (year: number) => set({ year }),
  setTimeFormat: (timeFormat: TimeFormat) => set({ timeFormat })
}))

export default useCalendarStore
