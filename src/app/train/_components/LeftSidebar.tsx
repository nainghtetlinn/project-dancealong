import { Disc } from 'lucide-react'

import { useAudio } from '@/provider/audio-provider'
import { formatTime } from '@/lib/utils'

const LeftSidebar = () => {
  const { audio, duration, currentTime } = useAudio()

  return (
    <div className='h-full p-2 border-r'>
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
    </div>
  )
}

export default LeftSidebar
