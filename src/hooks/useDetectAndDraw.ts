'use client'

import type { Keypoints } from '@/types'

import useDetection from './useDetection'
import useDraw from './useDraw'

const useDetectAndDraw = (
  width: number,
  height: number,
  callback: (keypoints: Keypoints) => void
) => {
  const { canvasRef, draw, clean } = useDraw(width, height)
  const { videoRef, start, stop } = useDetection(keypoints => {
    draw(keypoints)
    callback(keypoints)
  })

  return {
    videoRef,
    canvasRef,
    start,
    stop: () => {
      stop()
      clean()
    },
  }
}

export default useDetectAndDraw
