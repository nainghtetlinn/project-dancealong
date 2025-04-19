import { Button } from '@/components/ui/button'
import { Pause, Play } from 'lucide-react'

import { useAudio } from '@/provider/audio-provider'

const PlayBtn = () => {
  const { isPlaying, play, pause } = useAudio()

  return (
    <Button
      size='icon'
      onClick={() => {
        if (isPlaying) {
          pause()
        } else {
          play()
        }
      }}
    >
      {isPlaying ? <Pause /> : <Play />}
    </Button>
  )
}

export default PlayBtn
