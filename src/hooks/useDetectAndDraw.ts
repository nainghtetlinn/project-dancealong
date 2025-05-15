'use client'

import { type TKeypoints } from '@/types'

import { useEffect, useRef } from 'react'
import useDetection from './useDetection'
import useDraw from './useDraw'
import useWebcam from './useWebcam'

const useDetectAndDraw = (
  width: number,
  height: number,
  callback: (keypoints: TKeypoints) => void
) => {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const { videoRef, isEnable, isError, enable, disable } = useWebcam(
    width,
    height
  )
  const { canvasRef, draw, clean } = useDraw(width, height, {
    threshold: 0.3,
    point: { size: 16, color: 'oklch(0.705 0.213 47.604)', fillColor: 'white' },
    segment: { width: 2, color: 'oklch(0.705 0.213 47.604)' },
  })
  const { isDetecting, start, stop } = useDetection(videoRef, keypoints => {
    draw(keypoints)
    callbackRef.current(keypoints)
  })

  const startDetection = async (): Promise<void> => {
    await enable()
    await new Promise(resolve => setTimeout(resolve, 1000))
    start()
  }

  const stopDetection = () => {
    stop()
    clean()
    disable()
  }

  return {
    videoRef,
    isWebcamEnable: isEnable,
    isWebcamError: isError,

    canvasRef,
    draw,
    clean,

    isDetecting,
    startDetection,
    stopDetection,
  }
}

export default useDetectAndDraw
