import AudioTimeline from './audio/AudioTimeline'
import CapturedPoses from './CapturedPoses'

import { useAudio } from '@/provider/audio-provider'

const Controls = () => {
  const { audio } = useAudio()

  return (
    <main className='h-full space-y-2'>
      {audio !== null ? (
        <>
          <AudioTimeline />
          <CapturedPoses />
        </>
      ) : (
        <div className='h-full flex items-center justify-center text-muted-foreground'>
          Upload song to start editing
        </div>
      )}
    </main>
  )
}

export default Controls
