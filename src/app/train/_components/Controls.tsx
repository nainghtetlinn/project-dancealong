import { Disc } from 'lucide-react'
import SongUpload from './SongUpload'
import Player from './Player'

import { useAudio } from '@/provider/audio-provider'
import { formatTime } from '@/lib/utils'

const Controls = () => {
  const { audio, duration, currentTime } = useAudio()

  return (
    <main className='h-full'>
      <section className='flex justify-center gap-2'>
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
      </section>

      <section>{audio !== null ? <Player /> : <SongUpload />}</section>
    </main>
  )
}

export default Controls
