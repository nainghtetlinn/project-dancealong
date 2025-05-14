'use server'

import { type TChoreography } from '@/types'

import { createClient } from '@/utils/supabase/server'
import { uploadChoreographySchema } from '@/validators/choreography-validator'

type TReturn =
  | { success: true; data: TChoreography }
  | { success: false; message: string }

export async function uploadChoreography(
  inputs: any,
  songId: string
): Promise<TReturn> {
  const validation = uploadChoreographySchema.safeParse(inputs)

  if (!validation.success)
    return { success: false, message: validation.error.message }

  const supabase = await createClient()

  // Checking if song exists
  const { data: song, error: songError } = await supabase
    .from('songs')
    .select('id')
    .eq('id', songId)
    .single()

  if (songError) return { success: false, message: 'Something went wrong.' }

  const { error: deleteError } = await supabase
    .from('choreography')
    .delete()
    .eq('song_id', song.id)

  if (deleteError) return { success: false, message: 'Something went wrong.' }

  const { data, error: uploadError } = await supabase
    .from('choreography')
    .insert(
      validation.data.map(d => ({
        keypoints_json: JSON.stringify(d.keypoints),
        timestamp: d.timestamp,
        song_id: song.id,
      }))
    )
    .select('*')

  if (uploadError) return { success: false, message: 'Something went wrong.' }

  return { success: true, data }
}
