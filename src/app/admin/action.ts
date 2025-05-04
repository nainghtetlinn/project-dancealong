'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { projectCreateSchema } from '@/validators/project-validator'

export async function createProject(formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    project_name: formData.get('project_name'),
  }

  const { success, data } = projectCreateSchema.safeParse(rawData)

  if (!success) redirect('/error')

  const { error, data: project } = await supabase
    .from('projects')
    .insert(data)
    .select('*')
    .single()

  if (error) redirect('/error')

  redirect('/admin/' + project.id)
}

export async function uploadAudio(
  audioFile: File,
  duration: number,
  projectId: number
) {
  const supabase = await createClient()

  // Checking if project exists
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .single()

  if (!project || projectError) redirect('/error')

  const filePath = `${Date.now()}_${audioFile.name}`

  // Upload file
  const { data: audio, error: uploadError } = await supabase.storage
    .from('songs')
    .upload(filePath, audioFile)

  if (!audio || uploadError) redirect('/error')

  // Get public url
  const { data: url } = supabase.storage.from('songs').getPublicUrl(audio?.path)

  // Insert song row and get ID
  // Removes anything after the last dot (e.g., .mp3, .wav, .flac, etc.)
  const song_name = audioFile.name.replace(/\.[^/.]+$/, '')
  const { data: song, error: songError } = await supabase
    .from('songs')
    .insert({
      song_name,
      duration_in_seconds: duration > 0 ? duration : 0,
      song_public_url: url.publicUrl,
    })
    .select('id')
    .single()

  if (!song || songError) redirect('/error')

  // Update project
  const { error: updateError } = await supabase
    .from('projects')
    .update({ song_id: song.id })
    .eq('id', project.id)

  if (updateError) redirect('/error')
}
