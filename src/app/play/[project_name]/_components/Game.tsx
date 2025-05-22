'use client'

import { Loader2 } from 'lucide-react'
import AudioTimeline from './AudioTimeline'
import Room from './Room'

import { TParsedChoreography, TProject, TSong } from '@/types'

import { formatTime } from '@/lib/utils'
import { useAudio } from '../_lib/audioContext'
import { useModel } from '@/provider/model-provider'

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
  const { loading: modelLoading } = useModel()

  if (loading || modelLoading)
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loader2 className='animate-spin' />
      </div>
    )

  return (
    <>
      <div className='h-screen flex flex-col'>
        <section className='flex justify-between items-center'>
          <div className='p-2'>
            <h4 className='font-bold text-2xl'>{project.project_name}</h4>
            <p>
              {song.title} | {song.artist} | {formatTime(song.duration)}
            </p>
          </div>
          <div className='px-2 w-[450px]'>
            <AudioTimeline />
          </div>
        </section>

        <Room choreography={choreography} />
      </div>
    </>
  )
}
