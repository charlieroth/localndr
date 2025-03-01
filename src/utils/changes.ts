import { z } from 'zod'

export const eventChangeSchema = z.object({
  id: z.string(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  created: z.string(),
  modified: z.string().nullable().optional(),
  //
  modified_columns: z.array(z.string()).nullable().optional(),
  deleted: z.boolean().nullable().optional(),
  new: z.boolean().nullable().optional(),
})

export type EventChange = z.infer<typeof eventChangeSchema>

export const changeSetSchema = z.object({
  events: z.array(eventChangeSchema),
})

export type ChangeSet = z.infer<typeof changeSetSchema>
