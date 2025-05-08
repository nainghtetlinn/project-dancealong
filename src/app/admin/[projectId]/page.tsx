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

  const { data } = await supabase
    .from('projects')
    .select('*, songs(*), models(*)')
    .eq('id', projectId)
    .single()

  if (!data) redirect('/admin')

  return <Application project={data} />
}
