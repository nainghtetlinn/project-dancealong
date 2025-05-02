import { Button } from '@/components/ui/button'
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { createProject } from '../action'

export default function CreateNewProject() {
  return (
    <form action={createProject}>
      <Card>
        <CardHeader>
          <CardTitle>New project?</CardTitle>
          <CardDescription>Just give a project name.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <Label htmlFor='project_name'>Project name</Label>
            <Input
              id='project_name'
              name='project_name'
              type='text'
              required
            />
          </div>
        </CardContent>
        <CardFooter className='justify-end'>
          <Button
            size='sm'
            type='submit'
          >
            Create
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
