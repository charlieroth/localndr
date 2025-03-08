import { format } from 'date-fns'
import { useSearchParams } from 'react-router'

export interface FilterState {
  date?: string
}

export function getFilterStateFromSearchParams(searchParams: URLSearchParams): FilterState {
  const date = searchParams.get('date') ?? undefined
  return { date }
}

export function useFilterState(): [FilterState, (state: Partial<FilterState>) => void] {
  const [searchParams, setSearchParams] = useSearchParams()
  const state = getFilterStateFromSearchParams(searchParams)

  const setState = (state: Partial<FilterState>) => {
    const { date } = state
    setSearchParams((searchParams) => {
      if (date) {
        searchParams.set(`date`, format(date, 'yyyy-MM-dd'))
      } else {
        searchParams.delete(`date`)
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
  
  // if (filterState.query) {
  //   sqlWhere.push(`
  //     (
  //       setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
  //       setweight(to_tsvector('simple', coalesce(description, '')), 'B')
  //     ) @@ plainto_tsquery('simple', $${i++})
  //   `)
  //   sqlParams.push(filterState.query)
  // }
  if (filterState.date) {
    sqlWhere.push(`
      DATE(start_date) = DATE($${i++})
    `)
    sqlParams.push(filterState.date)
  }

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