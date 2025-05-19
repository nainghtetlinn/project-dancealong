'use client'

import { Loader2 } from 'lucide-react'
import AudioTimeline from './AudioTimeline'
import Room from './Room'

import { TParsedChoreography, TProject, TSong } from '@/types'

import { formatTime } from '@/lib/utils'
import { useAudio } from '../_lib/audioContext'

export default function Game({
  project,
  song,
  choreography,
}: {
  project: TProject
  song: TSong
  choreography: TParsedChoreography[]
}) {
  const { loading } = useAudio()

  if (loading)
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loader2 className='animate-spin' />
      </div>
    )

  return (
    <>
      <div className='h-screen overflow-hidden relative'>
        <section className='absolute top-0 left-0 right-0 z-10 flex justify-between items-center'>
          <div className='p-2'>
            <h6 className='font-bold text-sm'>{project.project_name}</h6>
            <h4 className='font-bold text-2xl'>{song.title}</h4>
            <p>
              {song.artist} | {formatTime(song.duration)}
            </p>
          </div>
          <div className='p-2 w-[450px]'>
            <AudioTimeline />
          </div>
        </section>

        <Room choreography={choreography} />
      </div>
    </>
  )
}
