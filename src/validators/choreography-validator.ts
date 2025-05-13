import { z } from 'zod'

export const uploadChoreographySchema = z.array(
  z.object({
    keypoints: z.array(z.array(z.number()).length(3)).length(17),
    timestamp: z.number().gte(0),
  })
)
