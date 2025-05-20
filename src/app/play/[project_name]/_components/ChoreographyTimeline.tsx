import HumanPose from '@/components/primitive/HumanPose'
import { TParsedChoreography } from '@/types'

import { RefObject, useEffect, useImperativeHandle, useRef } from 'react'

import { useAudio } from '../_lib/audioContext'

const WIDTH = 375
const HEIGHT = 250
const DURATION = 4000 // ms
const SPEED = WIDTH / DURATION // px/ms

export default function ChoreographyTimeline({
  ref,
  choreography,
}: {
  ref: RefObject<{
    callbackAnimationLoop: (delta: number, elasped: number) => void
    restartAnimation: () => void
  } | null>
  choreography: TParsedChoreography[]
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D>(null)

  const toRender = useRef<{ pose: HumanPose; start: number; end: number }[]>(
    choreography.map(c => {
      const newPose = new HumanPose(c.keypoints, WIDTH, HEIGHT)
      newPose.x = WIDTH
      return { start: c.timestamp - DURATION, end: c.timestamp, pose: newPose }
    })
  )
  const indexRef = useRef(0)
  const shiftTime = useRef(0)
  const hasAudioPlayed = useRef(false)

  const { play } = useAudio()

  function callbackAnimationLoop(delta: number, elasped: number) {
    const ctx = ctxRef.current!
    ctx.clearRect(0, 0, WIDTH, HEIGHT)

    for (let i = indexRef.current; i < choreography.length; i++) {
      const c = toRender.current[i]
      if (shiftTime.current === 0 && c.start < 0) {
        shiftTime.current = Math.abs(c.start)
      }

      if (elasped >= c.start + shiftTime.current) {
        c.pose.draw(ctx)
        c.pose.x -= SPEED * delta

        if (c.pose.x <= -WIDTH) {
          indexRef.current += 1
        }
      }
    }

    if (!hasAudioPlayed.current && shiftTime.current <= elasped) {
      play()
      hasAudioPlayed.current = true
    }
  }

  function restartAnimation() {
    indexRef.current = 0
    shiftTime.current = 0
    hasAudioPlayed.current = false
    toRender.current = choreography.map(c => {
      const newPose = new HumanPose(c.keypoints, WIDTH, HEIGHT)
      newPose.x = WIDTH
      return { start: c.timestamp - DURATION, end: c.timestamp, pose: newPose }
    })
    ctxRef.current?.clearRect(0, 0, WIDTH, HEIGHT)
  }

  useImperativeHandle(ref, () => ({
    callbackAnimationLoop,
    restartAnimation,
  }))

  useEffect(() => {
    if (canvasRef.current) ctxRef.current = canvasRef.current.getContext('2d')
  }, [])

  return (
    <div className='absolute bottom-0 right-0 border'>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
      />
    </div>
  )
}
