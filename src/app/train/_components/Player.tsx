import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Pause, Play, Trash } from 'lucide-react'

import { useAudio } from '@/provider/audio-provider'
import { useState } from 'react'

const Player = () => {
  const [shouldCount, setShouldCount] = useState(
    localStorage.getItem('shouldCount') === 'true'
  )

  const {
    isPlaying,
    play,
    playWithCounter,
    isCounting,
    pause,
    removeAudio,
    AudioWaveSurferContainer,
  } = useAudio()

  return (
    <div>
      {AudioWaveSurferContainer}

      <div className='p-2 flex justify-between'>
        <div className='flex items-center gap-2'>
          <Button
            size='icon'
            onClick={() => {
              if (isPlaying) {
                pause()
              } else {
                if (shouldCount) {
                  playWithCounter()
                } else {
                  play()
                }
              }
            }}
          >
            {isPlaying ? <Pause /> : <Play />}
          </Button>
          <div className='flex items-center gap-1'>
            <Checkbox
              id='count'
              checked={shouldCount}
              onCheckedChange={e => {
                setShouldCount(e as boolean)
                localStorage.setItem('shouldCount', String(e))
              }}
              disabled={shouldCount && isCounting}
            />
            <label
              htmlFor='count'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Play with counter
            </label>
          </div>
        </div>

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
    </div>
  )
}

export default Player
