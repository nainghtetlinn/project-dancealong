'use server'

import { type TSong } from '@/types'

import { createClient } from '@/utils/supabase/server'
import { uploadAudioSchema } from '@/validators/audio-validator'

type TReturn =
  | { success: true; data: TSong }
  | { success: false; message: string }

export async function uploadAudio(
  inputs: any,
  audioFile: File,
  projectId: string
): Promise<TReturn> {
  const validation = uploadAudioSchema.safeParse(inputs)

  if (!validation.success)
    return { success: false, message: validation.error.message }

  const supabase = await createClient()

  // Checking if project exists
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, project_name')
    .eq('id', projectId)
    .single()

  if (projectError) return { success: false, message: 'Something went wrong.' }

  const filePath = `${project.project_name}/${audioFile.name}`

  // Upload file
  const { data: audio, error: uploadError } = await supabase.storage
    .from('songs')
    .upload(filePath, audioFile)

  if (uploadError) return { success: false, message: 'Something went wrong.' }

  // Get public url
  const { data: url } = supabase.storage.from('songs').getPublicUrl(audio?.path)

  // Insert song row and get ID
  // Removes anything after the last dot (e.g., .mp3, .wav, .flac, etc.)
  const { data: song, error: insertError } = await supabase
    .from('songs')
    .insert({ ...validation.data, audio_url: url.publicUrl })
    .select('*')
    .single()

  if (insertError) return { success: false, message: 'Something went wrong.' }

  // Update project
  const { error: updateError } = await supabase
    .from('projects')
    .update({ song_id: song.id })
    .eq('id', project.id)

  if (updateError) return { success: false, message: 'Something went wrong.' }

  return { success: true, data: song }
}
