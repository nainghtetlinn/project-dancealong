'use client'

import { Button } from '@/components/ui/button'
import { Music, Pause, Play, MinusSquare } from 'lucide-react'

import { formatTime } from '@/lib/utils'
import { useAudio } from '../_lib/audioContext'

export default function AudioDetails() {
  const {
    audio,
    duration,
    currentTime,
    isPlaying,
    activeRegionId,
    play,
    pause,
    removeRegion,
  } = useAudio()

  return (
    <div className='flex justify-between items-center px-2 py-1'>
      <div className='flex items-center gap-2'>
        <Music
          size={26}
          className='text-primary'
        />
        <h4>{audio?.name}</h4>
      </div>

      <Button
        size='icon'
        variant='secondary'
        disabled={!activeRegionId}
        onClick={removeRegion}
      >
        <MinusSquare />
      </Button>

      <div className='flex items-center gap-2'>
        <p>
          <span className='text-muted-foreground'>{formatTime(duration)}</span>{' '}
          / {formatTime(currentTime)}
        </p>
        <Button
          size='icon'
          variant='secondary'
          onClick={isPlaying ? pause : play}
        >
          {isPlaying ? <Pause /> : <Play />}
        </Button>
      </div>
    </div>
  )
}
