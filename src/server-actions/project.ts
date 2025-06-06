'use server'

import { TProject, TReturn } from '@/types'

import { createClient } from '@/utils/supabase/server'
import { createProjectSchema } from '@/validators/project-validator'

export async function createProject(inputs: {
  project_name: string
}): Promise<TReturn<TProject>> {
  const validation = createProjectSchema.safeParse(inputs)

  if (!validation.success)
    return { success: false, message: validation.error.message }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .insert(validation.data)
    .select('*')
    .single()

  if (error) return { success: false, message: error.message }

  return { success: true, data }
}

export async function deleteProject(
  id: string
): Promise<TReturn<{ id: string }>> {
  const supabase = await createClient()

  const { error } = await supabase.from('projects').delete().eq('id', id)

  if (error) return { success: false, message: error.message }

  return { success: true, data: { id } }
}
