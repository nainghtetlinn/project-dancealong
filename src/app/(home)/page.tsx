import ProjectCard from './_components/ProjectCard'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  const { error, data } = await supabase
    .from('projects')
    .select('*, songs(*)')
    .not('song_id', 'is', null)

  if (error) redirect('/error')

  return (
    <main>
      <h5 className='text-center text-2xl font-bold p-2'>Dancealong</h5>
      <div className='p-2 mx-auto container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
        {data.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </main>
  )
}
