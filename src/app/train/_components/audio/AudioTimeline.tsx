import { useAudio } from '@/provider/audio-provider'

const AudioTimeline = () => {
  const { AudioWaveSurferContainer } = useAudio()

  return <div className='px-2'>{AudioWaveSurferContainer}</div>
}

export default AudioTimeline
