import { ShapeStreamOptions } from '@electric-sql/client'
import { baseUrl } from './electric.ts'

export const eventShape: ShapeStreamOptions = {
  url: `${baseUrl}/v1/shape`,
  params: {
    table: 'event',
  },
}
