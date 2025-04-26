import { Button } from '@/components/ui/button'
import { Music, Pause, Play, Trash } from 'lucide-react'

import { formatTime } from '@/lib/utils'
import { useAudio } from '@/provider/audio-provider'

const AudioDetails = () => {
  const { audio, duration, currentTime, removeAudio, isPlaying, play, pause } =
    useAudio()

  if (audio === null) return null

  return (
    <div className='flex justify-between items-center px-2 py-1'>
      <div className='flex items-center gap-2'>
        <Music
          size={26}
          className='text-primary'
        />
        <h4>{audio.name}</h4>
      </div>

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
        <Button
          size='icon'
          variant='destructive'
          onClick={removeAudio}
        >
          <Trash />
        </Button>
      </div>
    </div>
  )
}

export default AudioDetails
