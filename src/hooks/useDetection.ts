import * as tf from '@tensorflow/tfjs'
import { useRef } from 'react'
import { useModel } from '@/provider/model-provider'

const keypoints_order = [
  'nose',
  'left eye',
  'right eye',
  'left ear',
  'right ear',
  'left shoulder',
  'right shoulder',
  'left elbow',
  'right elbow',
  'left wrist',
  'right wrist',
  'left hip',
  'right hip',
  'left knee',
  'right knee',
  'left ankle',
  'right ankle',
]

const useDetection = (
  video: HTMLVideoElement | null,
  callback: (
    result: { x: number; y: number; score: number; name: string }[]
  ) => void
) => {
  const { model } = useModel()

  const animationFrameId = useRef(0)

  const detect = () => {
    if (model && video && video.readyState === 4) {
      console.log('Detecting ...')

      const inputTensor = tf.tidy(() =>
        tf.browser
          .fromPixels(video)
          .resizeBilinear([192, 192])
          .expandDims(0)
          .toInt()
      )

      const result = model.execute(inputTensor) as tf.Tensor

      const keypoints = (result.arraySync() as number[][][][])[0][0]

      const formatted = keypoints.map((kp, i) => {
        return { x: kp[1], y: kp[0], score: kp[2], name: keypoints_order[i] }
      })

      callback(formatted)

      tf.dispose([inputTensor, result])
    }

    animationFrameId.current = requestAnimationFrame(detect)
  }

  const stop = () => {
    console.log('Detection stopped')
    cancelAnimationFrame(animationFrameId.current)
  }

  return { detect, stop }
}

export default useDetection
