'use client'

import * as tf from '@tensorflow/tfjs'
import React, { createContext, useContext, useEffect, useState } from 'react'

const modelUri = '/movenet-tfjs-singlepose-lightning-v4/model.json'
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

const modelContext = createContext<{
  model: tf.GraphModel | null
  detectPose: (video: HTMLVideoElement) => number | undefined
}>({
  model: null,
  detectPose: () => {
    return 0
  },
})

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState<tf.GraphModel | null>(null)

  const loadModel = async () => {
    await tf.setBackend('webgl')
    await tf.ready()
    const m = await tf.loadGraphModel(modelUri)
    setModel(m)
    console.log('Model loaded')

    // const prediction = await model.executeAsync(
    //   tf.zeros([1, 192, 192, 3], 'int32')
    // )
    // console.log(prediction)
  }

  useEffect(() => {
    loadModel()
  }, [])

  const detectPose = (video: HTMLVideoElement) => {
    if (model) {
      const inputTensor = tf.tidy(() =>
        tf.browser
          .fromPixels(video)
          .resizeBilinear([192, 192])
          .expandDims(0)
          .toInt()
      )

      const result = model.execute(inputTensor) as tf.Tensor

      const keypoints = (result.arraySync() as number[][])[0][0]

      tf.dispose([inputTensor, result])

      return keypoints
    }
  }

  return (
    <modelContext.Provider value={{ model, detectPose }}>
      {children}
    </modelContext.Provider>
  )
}

export function useModel() {
  return useContext(modelContext)
}
