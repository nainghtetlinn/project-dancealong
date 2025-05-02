import CreateNewProject from './_components/CreateNewProject'

import { createClient } from '@/utils/supabase/server'

export default async function AdminPage() {
  const supabase = await createClient()

  const projects = supabase.from('projects').select('*')

  return (
    <main className='p-2 grid grid-cols-4 gap-2'>
      <CreateNewProject />
    </main>
  )
}
