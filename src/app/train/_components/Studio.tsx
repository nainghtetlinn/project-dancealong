import AudioDetails from './audio/AudioDetails'
import AudioUpload from './audio/AudioUpload'

import { useAudio } from '@/provider/audio-provider'

const Studio = () => {
  const { audio } = useAudio()

  return (
    <div className='h-full'>
      <main className='space-y-2'>
        {audio !== null ? <AudioDetails /> : <AudioUpload />}
      </main>
    </div>
  )
}

export default Studio
