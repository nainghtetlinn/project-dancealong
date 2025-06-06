import { ModeToggle } from '@/components/modeToggleBtn'

import Link from 'next/link'
import { ModelProvider } from '@/provider/model-provider'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) redirect('/login')

  return (
    <ModelProvider type='thunder'>
      <div className='flex flex-col h-screen'>
        <nav className='flex items-center justify-between px-4 py-2 border-b'>
          <Link href='/admin'>
            <h5>Admin Studio</h5>
          </Link>
          <div className='flex items-center gap-2'>
            <p>{data.user.email}</p>
            <ModeToggle />
          </div>
        </nav>
        <div className='flex-1'>{children}</div>
      </div>
    </ModelProvider>
  )
}
