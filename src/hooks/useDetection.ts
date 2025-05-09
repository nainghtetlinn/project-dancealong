'use client'

import type { Keypoints } from '@/types'

import * as tf from '@tensorflow/tfjs'
import { useModel } from '@/provider/model-provider'
import { useEffect, useRef } from 'react'

const useDetection = (callback: (keypoints: Keypoints) => void) => {
  const { constants, model } = useModel()

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const animationFrameId = useRef<number | null>(null)
  const isDetecting = useRef(false)

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

      const keypoints = (result.arraySync() as Keypoints[][])[0][0]

      callback(keypoints)
    })

    animationFrameId.current = requestAnimationFrame(detect)
  }

  const start = () => {
    if (!isDetecting.current) {
      isDetecting.current = true
      animationFrameId.current = requestAnimationFrame(detect)
      console.log('Detection started')
    }
  }

  const stop = () => {
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
      isDetecting.current = false
      console.log('Detection stopped')
    }
  }

  return { videoRef, start, stop }
}

export default useDetection
