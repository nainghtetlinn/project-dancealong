import { Button } from '@/components/ui/button'
import { Minus } from 'lucide-react'
import AudioDetails from './audio/AudioDetails'
import AudioTimeline from './audio/AudioTimeline'
import AudioUpload from './audio/AudioUpload'
import CapturedPoses from './CapturedPoses'

import { useAudio } from '@/provider/audio-provider'

const Studio = () => {
  const { audio, activeRegion, removeRegion } = useAudio()

  if (audio === null) return <AudioUpload />

  return (
    <section>
      <AudioDetails />
      <AudioTimeline />
      <div className='flex justify-center gap-2 p-2'>
        <Button
          size='icon'
          variant='destructive'
          disabled={!activeRegion}
          onClick={removeRegion}
        >
          <Minus />
        </Button>
      </div>
      <CapturedPoses />
    </section>
  )
}

export default Studio
