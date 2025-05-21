import { Button } from '@/components/ui/button'
import { Pause, Play } from 'lucide-react'

import { TKeypoints } from '@/types'

import { useRef, useState } from 'react'
import { toast } from 'sonner'

import useAnimationFrame from '@/hooks/useAnimationFrame'
import { findPosePair, interpolatePose } from '@/utils/pose'
import { useAudio } from '../../../_lib/audioContext'

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
  const lastPoseTimestampRef = useRef(-1)

  const [isAnimationPlaying, setIsAnimatinPlaying] = useState(false)

  const { isPlaying, currentTime, play, pause } = useAudio()

  const { start, stop } = useAnimationFrame(() => {
    if (isPlaying) {
      const tNow = currentTime * 1000
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
    }
  })

  const handleReplay = () => {
    if (choreography.length === 0)
      return toast.error('No choreography found to replay.')

    if (isAnimationPlaying) {
      stop()
      pause()
      clean()
      setIsAnimatinPlaying(false)
    } else {
      start()
      play()
      setIsAnimatinPlaying(true)
    }
  }

  return (
    <div className='space-x-2'>
      {isAnimationPlaying && <span>Animation is playing ...</span>}
      <Button
        size='icon'
        variant='secondary'
        onClick={handleReplay}
        {...props}
      >
        {isAnimationPlaying ? <Pause /> : <Play />}
      </Button>
    </div>
  )
}
