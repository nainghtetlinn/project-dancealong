'use client'

import { type TKeypoints } from '@/types'

import * as tf from '@tensorflow/tfjs'
import { RefObject, useEffect, useRef, useState } from 'react'

import { useModel } from '@/provider/model-provider'

const useDetection = (
  videoRef: RefObject<HTMLVideoElement | null>,
  callback: (keypoints: TKeypoints) => void
) => {
  const { constants, model } = useModel()

  const animationFrameId = useRef<number | null>(null)
  const callbackRef = useRef(callback)
  const [isDetecting, setIsDetecting] = useState(false)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const detect = () => {
    const video = videoRef.current
    if (!model || !video || video.readyState !== 4) {
      animationFrameId.current = requestAnimationFrame(detect)
      return
    }

    tf.tidy(() => {
      const inputTensor = tf.browser
        .fromPixels(video)
        .resizeBilinear([constants.height, constants.width])
        .expandDims(0)
        .toInt()

      const result = model.execute(inputTensor) as tf.Tensor
      const keypoints = (result.arraySync() as TKeypoints[][])[0][0]
      callbackRef.current(keypoints)
    })

    animationFrameId.current = requestAnimationFrame(detect)
  }

  const start = () => {
    if (!isDetecting) {
      setIsDetecting(true)
      animationFrameId.current = requestAnimationFrame(detect)
    }
  }

  const stop = () => {
    if (animationFrameId.current !== null) {
      setIsDetecting(false)
      cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
    }
  }

  return { isDetecting, start, stop }
}

export default useDetection
