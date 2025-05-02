import { z } from 'zod'

export const projectCreateSchema = z.object({
  project_name: z.string().min(6),
})
