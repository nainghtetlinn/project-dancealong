import * as tf from '@tensorflow/tfjs'
import { useRef } from 'react'
import { useModel } from '@/provider/model-provider'

const LIGHTNING_INPUT_WIDTH = 192
const LIGHTNING_INPUT_HEIGHT = 192
const THUNDER_INPUT_WIDTH = 256
const THUNDER_INPUT_HEIGHT = 256

const useDetection = (
  video: HTMLVideoElement | null,
  callback: (keypoints: number[][]) => void
) => {
  const { type, model } = useModel()

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
        .resizeBilinear(
          type === 'thunder'
            ? [THUNDER_INPUT_HEIGHT, THUNDER_INPUT_WIDTH]
            : [LIGHTNING_INPUT_HEIGHT, LIGHTNING_INPUT_WIDTH]
        )
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
