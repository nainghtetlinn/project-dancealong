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
