import AudioUpload from './audio/AudioUpload'

import { useAudio } from '@/provider/audio-provider'

const Studio = () => {
  const { audio } = useAudio()

  if (audio === null) return <AudioUpload />

  return <section>Hello</section>
}

export default Studio
