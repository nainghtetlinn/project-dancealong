'use client'

import { useTrain } from '@/provider/train-provider'
import { useEffect, useRef } from 'react'
import useDetection from './useDetection'
import useDraw from './useDraw'

const useDetectAndDraw = (
  video: HTMLVideoElement | null,
  canvas: HTMLCanvasElement | null,
  callback: (keypoints: number[][]) => void
) => {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const { constants } = useTrain()

  const { draw, clean } = useDraw(
    canvas,
    constants.canvas.width,
    constants.canvas.height
  )
  const { start, stop } = useDetection(video, keypoints => {
    draw(keypoints)
    callbackRef.current(keypoints)
  })

  return {
    start,
    stop: () => {
      stop()
      clean()
    },
  }
}

export default useDetectAndDraw
