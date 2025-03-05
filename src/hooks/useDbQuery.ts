import { useState, useEffect } from 'react'
import { useDatabaseStore, PGliteWorkerWithLive } from '../stores/databaseStore'

/**
 * Hook for executing database queries with built-in sync awareness
 * 
 * @param queryFn Function that takes the pg instance and returns a query result
 * @param deps Dependencies array for when to re-run the query
 * @returns Object containing data, loading state, and error information
 */
export function useDbQuery<T>(
  queryFn: (pg: PGliteWorkerWithLive) => Promise<T>,
  deps: React.DependencyList = []
) {
  const { withDatabase, syncStatus } = useDatabaseStore()
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      if (syncStatus === 'error') {
        setError(new Error('Database synchronization failed'))
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await withDatabase(queryFn)
        if (isMounted) {
          setData(result)
          setIsLoading(false)
        }
      } catch (err) {
        console.error('Query error:', err)
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withDatabase, syncStatus, ...deps])

  return { data, isLoading, error }
}

/**
 * Hook for executing live queries with built-in sync awareness
 * 
 * @param queryFn Function that sets up a live query subscription
 * @param deps Dependencies array for when to re-run the live query setup
 * @returns Object containing data, loading state, and error information
 */
export function useLiveQuery<T>(
  queryFn: (pg: PGliteWorkerWithLive) => Promise<{ data: T; unsubscribe?: () => void }>,
  deps: React.DependencyList = []
) {
  const { withDatabase, syncStatus } = useDatabaseStore()
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true
    const cleanupFns: Array<() => void> = []

    const setupLiveQuery = async () => {
      if (syncStatus === 'error') {
        setError(new Error('Database synchronization failed'))
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await withDatabase(queryFn)
        if (isMounted) {
          setData(result.data)
          setIsLoading(false)
          
          if (result.unsubscribe) {
            cleanupFns.push(result.unsubscribe)
          }
        }
      } catch (err) {
        console.error('Live query error:', err)
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setIsLoading(false)
        }
      }
    }

    setupLiveQuery()

    return () => {
      isMounted = false
      cleanupFns.forEach(fn => fn())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withDatabase, syncStatus, ...deps])

  return { data, isLoading, error }
} 