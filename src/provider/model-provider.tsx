'use client'

import { TKeypoints } from '@/types'

import * as tf from '@tensorflow/tfjs'
import React, { createContext, useContext, useEffect, useState } from 'react'

const lightningUri = '/movenet-tfjs-singlepose-lightning-v4/model.json'
const MOVENET_LIGHTNING_INPUT_WIDTH = 192
const MOVENET_LIGHTNING_INPUT_HEIGHT = 192

const thunderUri = '/movenet-tfjs-singlepose-thunder-v4/model.json'
const MOVENET_THUNDER_INPUT_WIDTH = 256
const MOVENET_THUNDER_INPUT_HEIGHT = 256

interface ModelContext {
  loading: boolean
  model: tf.GraphModel | null
  type: 'lightning' | 'thunder'
  constants: { width: number; height: number }
  detect: (video: HTMLVideoElement) => TKeypoints
}

const modelContext = createContext<ModelContext>({
  model: null,
  loading: true,
  type: 'lightning',
  constants: {
    width: MOVENET_LIGHTNING_INPUT_WIDTH,
    height: MOVENET_LIGHTNING_INPUT_HEIGHT,
  },
  detect: () => {
    return []
  },
})

export function ModelProvider({
  children,
  type,
  disable = false,
}: {
  children: React.ReactNode
  type: 'lightning' | 'thunder'
  disable?: boolean
}) {
  const constants =
    type === 'thunder'
      ? {
          width: MOVENET_THUNDER_INPUT_WIDTH,
          height: MOVENET_THUNDER_INPUT_HEIGHT,
        }
      : {
          width: MOVENET_LIGHTNING_INPUT_WIDTH,
          height: MOVENET_LIGHTNING_INPUT_HEIGHT,
        }

  const [model, setModel] = useState<tf.GraphModel | null>(null)
  const [loading, setLoading] = useState(true)

  const loadModel = async () => {
    try {
      setLoading(true)

      await tf.setBackend('webgl')
      await tf.ready()
      const m = await tf.loadGraphModel(
        type === 'thunder' ? thunderUri : lightningUri
      )
      setModel(m)
      console.log('Model loaded:', type)

      // Warm up the model by passing zeros through it once
      tf.tidy(() => {
        const answer = m.execute(
          type === 'thunder'
            ? tf
                .zeros([
                  1,
                  MOVENET_THUNDER_INPUT_HEIGHT,
                  MOVENET_THUNDER_INPUT_WIDTH,
                  3,
                ])
                .toInt()
            : tf
                .zeros([
                  1,
                  MOVENET_LIGHTNING_INPUT_HEIGHT,
                  MOVENET_LIGHTNING_INPUT_WIDTH,
                  3,
                ])
                .toInt()
        ) as tf.Tensor
        console.log('Warm up:', type, answer.squeeze().arraySync())
      })
    } catch (error) {
      console.error('Error loading model:', type, error)
    } finally {
      setLoading(false)
    }
  }

  const detect = (video: HTMLVideoElement): TKeypoints => {
    return tf.tidy(() => {
      const inputTensor = tf.browser
        .fromPixels(video)
        .resizeBilinear([constants.height, constants.width])
        .expandDims(0)
        .toInt()

      const result = model!.execute(inputTensor) as tf.Tensor
      const keypoints = (result.arraySync() as TKeypoints[][])[0][0]

      return keypoints
    })
  }

  useEffect(() => {
    if (!disable) {
      loadModel()
    }
  }, [disable])

  return (
    <modelContext.Provider
      value={{
        constants,
        type,
        model,
        loading,
        detect,
      }}
    >
      {children}
    </modelContext.Provider>
  )
}

export function useModel() {
  return useContext(modelContext)
}
