'use server'

import { type TProject } from '@/types'

import { createClient } from '@/utils/supabase/server'
import { createProjectSchema } from '@/validators/project-validator'

type TReturn =
  | { success: true; data: TProject }
  | { success: false; message: string }

export async function createProject(inputs: any): Promise<TReturn> {
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
