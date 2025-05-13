import { z } from 'zod'

export const createProjectSchema = z.object({
  project_name: z.string().min(1, 'Project name required.'),
})
