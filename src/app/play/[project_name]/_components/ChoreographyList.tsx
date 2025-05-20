import { TParsedChoreography } from '@/types'

import { RefObject, useImperativeHandle, useRef } from 'react'

import useDraw from '@/hooks/useDraw'
import { findPosePair, interpolatePose } from '@/utils/pose'
import { useAudio } from '../_lib/audioContext'

const WIDTH = 720
const HEIGHT = 480

export default function ChoreographyList({
  ref,
  choreography,
}: {
  ref: RefObject<{
    callbackAnimationLoop: (delta: number, elasped: number) => void
    restartAnimation: () => void
  } | null>
  choreography: TParsedChoreography[]
}) {
  const lastPoseTimestampRef = useRef(-1)

  const { currentTime } = useAudio()

  const { canvasRef, clean, draw } = useDraw(WIDTH, HEIGHT)

  function callbackAnimationLoop() {
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

  function restartAnimation() {
    clean()
  }

  useImperativeHandle(ref, () => ({
    callbackAnimationLoop,
    restartAnimation,
  }))

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      className='border'
    />
  )
}
