'use client'

import type { Keypoints } from '@/types'

import { useEffect, useRef } from 'react'
import useDetection from './useDetection'
import useDraw from './useDraw'

const useDetectAndDraw = (
  video: HTMLVideoElement | null,
  canvas: HTMLCanvasElement | null,
  width: number,
  height: number,
  callback: (keypoints: Keypoints) => void
) => {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const { draw, clean } = useDraw(canvas, width, height)
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
