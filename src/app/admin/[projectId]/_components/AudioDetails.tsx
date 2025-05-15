'use client'

import { Button } from '@/components/ui/button'
import { Music, Pause, Play } from 'lucide-react'

import { formatTime } from '@/lib/utils'
import { useAudio } from '../_lib/audioContext'
import { useProjectDetails } from '../_lib/projectContext'

export default function AudioDetails() {
  const { song } = useProjectDetails()
  const { duration, currentTime, isPlaying, play, pause } = useAudio()

  return (
    <div className='flex justify-between items-center p-2'>
      <div className='flex items-center gap-2'>
        <Music
          size={26}
          className='text-primary'
        />
        <h4>{song?.title}</h4>
        <p className='text-sm text-muted-foreground'>({song?.artist})</p>
      </div>

      <div className='flex items-center gap-2'>
        <p>
          <span className='text-muted-foreground'>{formatTime(duration)}</span>{' '}
          / {formatTime(currentTime)}
        </p>
        <Button
          size='icon'
          variant='secondary'
          onClick={isPlaying ? pause : () => play()}
        >
          {isPlaying ? <Pause /> : <Play />}
        </Button>
      </div>
    </div>
  )
}
