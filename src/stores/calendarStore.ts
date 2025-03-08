import { create } from 'zustand'
import { TimeFormat } from '@/types'

type State = {
  timeFormat: TimeFormat
}

type Action = {
  setTimeFormat: (timeFormat: TimeFormat) => void
}

const useCalendarStore = create<State & Action>()((set) => ({
  timeFormat: '12h',
  setTimeFormat: (timeFormat: TimeFormat) => set({ timeFormat })
}))

export default useCalendarStore
