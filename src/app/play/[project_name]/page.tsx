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

  const { data: song } = await supabase
    .from('songs')
    .select('*')
    .eq('id', project.song_id)
    .single()

  if (!project || !song) redirect('/')

  return (
    <Application
      project={project}
      song={song}
    />
  )
}
