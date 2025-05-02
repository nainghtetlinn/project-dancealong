'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { loginSchema } from '@/validators/login-validator'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { success, data } = loginSchema.safeParse(rawData)

  if (!success) redirect('/error')

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) redirect('/error')

  revalidatePath('/', 'layout')
  redirect('/admin')
}
