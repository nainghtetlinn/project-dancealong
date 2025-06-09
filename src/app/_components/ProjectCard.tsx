import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import MiniWaveForm from '@/app/admin/_components/MiniWaveForm'

import { type TSong } from '@/types'

import { formatTime } from '@/lib/utils'
import Link from 'next/link'

export type TProject = {
  id: string
  project_name: string
  song_id: string | null
  created_at: string
  songs: TSong
}

export default function ProjectCard({ project }: { project: TProject }) {
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
          size='sm'
          variant='secondary'
          asChild
        >
          <Link href={`/play/${project.id}`}>Play</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
