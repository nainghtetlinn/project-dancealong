import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Edit2 } from 'lucide-react'
import DeleteProjectBtn from './DeleteProjectBtn'
import MiniWaveForm from './MiniWaveForm'

import { TProject, TSong } from '@/types'

import { formatTime } from '@/lib/utils'
import Link from 'next/link'

export default async function ProjectCard({
  project,
}: {
  project: TProject & { songs: TSong }
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.project_name}</CardTitle>

        <CardDescription>
          {project.songs
            ? `${project.songs.title} | ${formatTime(project.songs.duration)}`
            : 'No song uploaded yet.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {project.songs ? (
          <MiniWaveForm url={project.songs.audio_url} />
        ) : (
          <div className='h-[60px]'></div>
        )}
      </CardContent>
      <CardFooter className='justify-end gap-2'>
        <Button
          size='icon'
          variant='secondary'
          asChild
        >
          <Link href={`/admin/${project.id}`}>
            <Edit2 />
          </Link>
        </Button>
        <DeleteProjectBtn id={project.id} />
      </CardFooter>
    </Card>
  )
}
