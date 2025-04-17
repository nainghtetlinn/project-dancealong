import { Disc, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { formatTime } from '@/lib/utils'
import { useAudio } from '@/provider/audio-provider'

const SongDetails = () => {
  const { audio, duration, currentTime, removeAudio } = useAudio()

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

      <Button
        size='icon'
        variant='destructive'
        className='absolute top-1/2 -translate-y-1/2 right-2'
        disabled={audio === null}
        onClick={() => {
          removeAudio()
        }}
      >
        <Trash />
      </Button>
    </section>
  )
}

export default SongDetails
