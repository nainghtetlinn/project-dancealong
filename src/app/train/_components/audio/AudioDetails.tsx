import { Disc, Trash, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { formatTime } from '@/lib/utils'
import { useAudio } from '@/provider/audio-provider'

const AudioDetails = () => {
  const { audio, duration, currentTime, removeAudio, isPlaying, play, pause } =
    useAudio()

  return (
    <section className='relative flex justify-center'>
      <div className='flex gap-2'>
        <Disc
          size={30}
          className='shrink-0'
        />
        <div>
          <h4 className='font-bold'>{audio?.name || 'Choose a song'}</h4>
          <p className='text-center'>
            {formatTime(currentTime)}/{formatTime(duration)}
          </p>
        </div>
      </div>

      <div className='absolute top-1/2 -translate-y-1/2 right-0 space-x-2'>
        <Button
          size='icon'
          variant='secondary'
          onClick={() => {
            if (isPlaying) {
              pause()
            } else {
              play()
            }
          }}
        >
          {isPlaying ? <Pause /> : <Play />}
        </Button>
        <Button
          size='icon'
          variant='destructive'
          onClick={() => {
            removeAudio()
          }}
        >
          <Trash />
        </Button>
      </div>
    </section>
  )
}

export default AudioDetails
