import { format } from 'date-fns'
import { useSearchParams } from 'react-router'
import { CalendarView } from '@/types'

export interface FilterState {
  startDate?: string
  endDate?: string
  date?: string
  view?: CalendarView
}

export function getFilterStateFromSearchParams(searchParams: URLSearchParams): FilterState {
  const view = searchParams.get('view') as CalendarView | undefined
  const date = searchParams.get('date') ?? undefined 
  const startDate = searchParams.get('startDate') ?? undefined
  const endDate = searchParams.get('endDate') ?? undefined
  return { date, view, startDate, endDate }
}

export function useFilterState(): [FilterState, (state: Partial<FilterState>) => void] {
  const [searchParams, setSearchParams] = useSearchParams()
  const state = getFilterStateFromSearchParams(searchParams)

  const setState = (state: Partial<FilterState>) => {
    const { date, view, startDate, endDate } = state
    setSearchParams((searchParams) => {
      if (date) {
        searchParams.set(`date`, format(date, 'yyyy-MM-dd'))
      } else {
        searchParams.delete(`date`)
      }

      if (view) {
        searchParams.set(`view`, view)
      } else {
        searchParams.delete(`view`)
      }

      if (startDate) {
        searchParams.set(`startDate`, startDate)
      } else {
        searchParams.delete(`startDate`)
      }

      if (endDate) {
        searchParams.set(`endDate`, endDate)
      } else {
        searchParams.delete(`endDate`)
      }

      return searchParams
    })
  }

  return [state, setState]
}

export function filterStateToSql(filterState: FilterState) {
  let i = 1
  const sqlWhere = []
  const sqlParams = []

  if (filterState.view === 'day') {
    // query for calendar events for a specific day
    sqlWhere.push(`
      DATE(start_date) = DATE($${i++})
    `)
    sqlParams.push(filterState.date)
  } else if (filterState.view === 'week' || filterState.view === 'month') {
    // query for calendar events for a specific week/month
    sqlWhere.push(`
      DATE(start_date) BETWEEN DATE($${i++}) AND DATE($${i++})
    `)
    sqlParams.push(filterState.startDate)
    sqlParams.push(filterState.endDate)
  } else {
    sqlWhere.push(`
      DATE(start_date) = DATE($${i++})
    `)
    sqlParams.push(format(new Date(), 'yyyy-MM-dd'))
  }
  
  // if (filterState.query) {
  //   sqlWhere.push(`
  //     (
  //       setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
  //       setweight(to_tsvector('simple', coalesce(description, '')), 'B')
  //     ) @@ plainto_tsquery('simple', $${i++})
  //   `)
  //   sqlParams.push(filterState.query)
  // }

  const sql = `
    SELECT id, title, description, start_date, end_date, created, modified
    FROM event
    WHERE
      ${sqlWhere.length ? `${sqlWhere.join(' AND ')} AND ` : ''}
      deleted = false
    ORDER BY start_date ASC
  `
  return { sql, sqlParams }
}