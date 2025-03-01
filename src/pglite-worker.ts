import { worker } from '@electric-sql/pglite/worker'
import { PGlite } from '@electric-sql/pglite'
import { migrate } from './migrations.ts'

worker({
  async init() {
    const pg = await PGlite.create({
      dataDir: 'idb://localndr',
      relaxedDurability: true,
    })

    await migrate(pg)
    return pg
  },
})
