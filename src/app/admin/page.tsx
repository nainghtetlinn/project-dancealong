import CreateNewProject from './_components/CreateNewProject'
import ProjectCard from './_components/ProjectCard'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function AdminPage() {
  const supabase = await createClient()

  const { error, data } = await supabase.from('projects').select('*, songs(*)')

  if (error) redirect('/error')

  return (
    <main className='p-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2'>
      <CreateNewProject />
      {data.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
        />
      ))}
    </main>
  )
}
