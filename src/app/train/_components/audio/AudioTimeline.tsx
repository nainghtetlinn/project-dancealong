import { useAudio } from '@/provider/audio-provider'

const AudioTimeline = () => {
  const { AudioWaveSurferContainer } = useAudio()

  return <section>{AudioWaveSurferContainer}</section>
}

export default AudioTimeline
