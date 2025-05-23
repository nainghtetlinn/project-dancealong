import Application from './application'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (!project) redirect('/admin')

  const { data: song } = await supabase
    .from('songs')
    .select('*')
    .eq('id', project.song_id)
    .single()

  const { data: choreography } = await supabase
    .from('choreography')
    .select('*')
    .eq('song_id', project.song_id)
    .order('timestamp', { ascending: true })

  return (
    <Application
      project={project}
      song={song}
      choreography={choreography}
    />
  )
}
