import { create } from 'zustand'
import { PGliteWorker } from '@electric-sql/pglite/worker'
import { live, LiveNamespace } from '@electric-sql/pglite/live'
import { electricSync } from '@electric-sql/pglite-sync'
import PGWorker from '../pglite-worker.js?worker'
import { startSync } from '../sync'
import type { PGliteWithLive } from '@electric-sql/pglite/live'
import type { PGliteWithSync } from '@electric-sql/pglite-sync'

export type PGliteWorkerWithLive = PGliteWorker & { live: LiveNamespace }
export type SyncStatus = 'initializing' | 'syncing' | 'ready' | 'error'

export type DatabaseStore = {
  // State
  pg: PGliteWorkerWithLive | null
  syncStatus: SyncStatus
  syncMessage: string
  isInitialized: boolean
  
  // Actions
  initialize: () => Promise<void>
  setSyncStatus: (status: SyncStatus, message?: string) => void
  
  // Utility functions
  withDatabase: <T>(fn: (pg: PGliteWorkerWithLive) => Promise<T>) => Promise<T>
}

export const useDatabaseStore = create<DatabaseStore>((set, get) => ({
  pg: null,
  syncStatus: 'initializing',
  syncMessage: 'Initializing database...',
  isInitialized: false,
  
  initialize: async () => {
    if (get().isInitialized) return
    
    try {
      set({ syncStatus: 'initializing', syncMessage: 'Starting PGlite...' })
      
      const pg = await PGliteWorker.create(new PGWorker(), {
        extensions: {
          live,
          sync: electricSync(),
        },
      })
      
      set({ pg, isInitialized: true })
      
      let syncStarted = false
      pg.onLeaderChange(() => {
        console.log('Leader changed', pg.isLeader)
        if (pg.isLeader && !syncStarted) {
          syncStarted = true
          set({ syncStatus: 'syncing', syncMessage: 'Starting sync process...' })
          startSync(pg as PGliteWithLive & PGliteWithSync)
            .then(() => {
              set({ syncStatus: 'ready', syncMessage: 'Database ready' })
            })
            .catch((error) => {
              console.error('Error during sync:', error)
              set({ 
                syncStatus: 'error', 
                syncMessage: `Sync error: ${error.message || 'Unknown error'}`
              })
            })
        }
      })
    } catch (error) {
      console.error('Error initializing database:', error)
      set({ 
        syncStatus: 'error', 
        syncMessage: `Initialization error: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    }
  },
  
  setSyncStatus: (status, message) => {
    set({ 
      syncStatus: status, 
      syncMessage: message || (status === 'ready' ? 'Database ready' : 'Processing...') 
    })
  },
  
  withDatabase: async <T>(fn: (pg: PGliteWorkerWithLive) => Promise<T>): Promise<T> => {
    const { pg, syncStatus, initialize } = get()
    
    if (!pg) {
      await initialize()
    }
    
    // Wait until sync is ready
    if (syncStatus !== 'ready') {
      await new Promise<void>((resolve) => {
        const checkSync = () => {
          const currentStatus = get().syncStatus
          if (currentStatus === 'ready') {
            resolve()
          } else if (currentStatus === 'error') {
            throw new Error(`Database sync error: ${get().syncMessage}`)
          } else {
            setTimeout(checkSync, 100)
          }
        }
        checkSync()
      })
    }
    
    const database = get().pg
    if (!database) {
      throw new Error('Database is not available')
    }
    
    return fn(database)
  }
})) 