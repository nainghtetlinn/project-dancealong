import * as tf from '@tensorflow/tfjs'
import { useRef } from 'react'
import { useModel } from '@/provider/model-provider'

const INPUT_WIDTH = 192
const INPUT_HEIGHT = 192

const useDetection = (
  video: HTMLVideoElement | null,
  callback: (keypoints: number[][]) => void
) => {
  const { model } = useModel()

  const animationFrameId = useRef<number | null>(null)
  const isDetecting = useRef(false)

  const detect = () => {
    if (!model || !video || video.readyState !== 4) {
      animationFrameId.current = requestAnimationFrame(detect)
      return
    }

    console.log('Detecting ...')

    tf.tidy(() => {
      const inputTensor = tf.browser
        .fromPixels(video)
        .resizeBilinear([INPUT_HEIGHT, INPUT_WIDTH])
        .expandDims(0)
        .toInt()

      const result = model.execute(inputTensor) as tf.Tensor

      const keypoints = (result.arraySync() as number[][][][])[0][0]

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

  return { start, stop }
}

export default useDetection
