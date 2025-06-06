'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { createProjectSchema } from '@/validators/project-validator'
import { createProject } from '@/server-actions/project'

type TForm = z.infer<typeof createProjectSchema>

export default function CreateNewProject() {
  const router = useRouter()

  const form = useForm<TForm>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      project_name: '',
    },
  })

  const [loading, setLoading] = useState(false)

  const onSubmit = async (values: TForm) => {
    setLoading(true)
    const result = await createProject(values)

    if (!result.success) toast.error(result.message)
    else {
      toast.success('Successfully created.')
      router.push('/admin/' + result.data.id)
      form.reset()
    }

    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>New project?</CardTitle>
            <CardDescription>Just give a project name.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name='project_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className='justify-end'>
            <Button
              size='sm'
              type='submit'
              disabled={loading}
            >
              Create {loading && <Loader2 className='animate-spin' />}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
