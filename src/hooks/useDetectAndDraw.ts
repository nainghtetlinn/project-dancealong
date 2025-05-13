'use client'

import { type TKeypoints } from '@/types'

import useDetection from './useDetection'
import useDraw from './useDraw'
import { useRef, useEffect } from 'react'

const useDetectAndDraw = (
  width: number,
  height: number,
  callback: (keypoints: TKeypoints) => void
) => {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const { canvasRef, draw, clean } = useDraw(width, height, {
    threshold: 0.3,
    point: { size: 16, color: 'oklch(0.705 0.213 47.604)', fillColor: 'white' },
    segment: { width: 2, color: 'oklch(0.705 0.213 47.604)' },
  })
  const { videoRef, start, stop } = useDetection(keypoints => {
    draw(keypoints)
    callbackRef.current(keypoints)
  })

  return {
    videoRef,
    canvasRef,
    start,
    stop: () => {
      stop()
      clean()
    },
    clean,
    draw,
  }
}

export default useDetectAndDraw
