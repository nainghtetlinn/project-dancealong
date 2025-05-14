import { Button } from '@/components/ui/button'
import { Pause, Play } from 'lucide-react'

import { type TKeypoints } from '@/types'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { useAudio } from '../../../_lib/audioContext'
import { findPosePair, interpolatePose } from '@/utils/pose'

type Props = React.ComponentProps<'button'> & {
  choreography: { keypoints: TKeypoints; timestamp: number }[]
  draw: (kp: TKeypoints) => void
  clean: () => void
}

export default function PlayBtn({
  choreography,
  draw,
  clean,
  ...props
}: Props) {
  const animationFrameId = useRef<number | null>(null)
  const isAudioPlayingRef = useRef(false)
  const audioCurrentTimeRef = useRef(0)
  const lastPoseTimestampRef = useRef(-1)

  const { isPlaying, currentTime, play, pause } = useAudio()

  useEffect(() => {
    isAudioPlayingRef.current = isPlaying
    audioCurrentTimeRef.current = currentTime
  }, [isPlaying, currentTime])

  const playbackLoop = () => {
    if (isAudioPlayingRef.current) {
      const tNow = audioCurrentTimeRef.current * 1000
      const posePair = findPosePair(choreography, tNow)
      if (posePair && tNow !== lastPoseTimestampRef.current) {
        const [poseA, poseB] = posePair
        const interpolated = interpolatePose(
          poseA.keypoints,
          poseB.keypoints,
          poseA.timestamp,
          poseB.timestamp,
          tNow
        )
        draw(interpolated)
        lastPoseTimestampRef.current = tNow
      }
      animationFrameId.current = requestAnimationFrame(playbackLoop)
    } else {
      clean()
      cancelPlaybackLoop()
    }
  }

  const cancelPlaybackLoop = () => {
    cancelAnimationFrame(animationFrameId.current!)
    animationFrameId.current = null
  }

  const handleReplay = () => {
    if (choreography.length === 0)
      return toast.error('No choreography found to replay.')

    if (!isPlaying) {
      isAudioPlayingRef.current = true
      animationFrameId.current = requestAnimationFrame(playbackLoop)
      play()
    } else {
      pause()
    }
  }

  return (
    <Button
      size='icon'
      variant='secondary'
      onClick={handleReplay}
      {...props}
    >
      {isPlaying ? <Pause /> : <Play />}
    </Button>
  )
}
