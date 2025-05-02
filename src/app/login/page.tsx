import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogIn } from 'lucide-react'

import { login } from './action'

export default function LoginPage() {
  return (
    <div className='flex justify-center items-center w-full h-screen'>
      <form action={login}>
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                name='password'
                type='password'
                required
              />
            </div>
          </CardContent>
          <CardFooter className='flex justify-end'>
            <Button
              type='submit'
              className='cursor-pointer'
            >
              Login <LogIn />
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
