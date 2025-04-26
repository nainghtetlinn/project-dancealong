import AudioDetails from './audio/AudioDetails'
import AudioTimeline from './audio/AudioTimeline'
import AudioUpload from './audio/AudioUpload'
import CapturedPoses from './CapturedPoses'

import { useAudio } from '@/provider/audio-provider'

const Studio = () => {
  const { audio } = useAudio()

  if (audio !== null) return <AudioUpload />

  return (
    <section>
      {/* <AudioDetails /> */}
      {/* <AudioTimeline /> */}
      <CapturedPoses />
    </section>
  )
}

export default Studio
