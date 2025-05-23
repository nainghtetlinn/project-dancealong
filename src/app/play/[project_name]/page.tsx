import Application from './application'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Play({
  params,
}: {
  params: Promise<{ project_name: string }>
}) {
  const { project_name } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('project_name', project_name)
    .not('song_id', 'is', null)
    .single()

  if (!project) redirect('/')

  const { data: song } = await supabase
    .from('songs')
    .select('*')
    .eq('id', project.song_id)
    .single()

  if (!song) redirect('/')

  const { data: choreography } = await supabase
    .from('choreography')
    .select('*')
    .eq('song_id', project.song_id)
    .order('timestamp', { ascending: true })

  if (!choreography) redirect('/')

  return (
    <Application
      project={project}
      song={song}
      choreography={choreography.map(c => ({
        id: c.id,
        timestamp: c.timestamp,
        keypoints: JSON.parse(c.keypoints_json),
        is_key_pose: c.is_key_pose,
        image_url: c.image_url,
        song_id: c.song_id,
      }))}
    />
  )
}
