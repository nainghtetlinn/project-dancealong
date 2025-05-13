import { z } from 'zod'

export const uploadAudioSchema = z.object({
  title: z.string().min(1, 'Title required.'),
  artist: z.string().min(1, 'Artist name required.'),
  duration: z.coerce.number().gt(0),
})
