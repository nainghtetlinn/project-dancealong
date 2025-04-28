'use client'

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
  classificationModel: tf.Sequential | null
  classificationLabels: string[]
  uploadClassificationModel: (result: {
    labels: string[]
    model: tf.Sequential
  }) => void
  classify: (keypoints: number[][]) => void
}

const modelContext = createContext<ModelContext>({
  model: null,
  loading: true,
  type: 'lightning',
  constants: {
    width: MOVENET_LIGHTNING_INPUT_WIDTH,
    height: MOVENET_LIGHTNING_INPUT_HEIGHT,
  },
  classificationModel: null,
  classificationLabels: [],
  uploadClassificationModel: () => {},
  classify: () => {},
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
  const [model, setModel] = useState<tf.GraphModel | null>(null)
  const [classificationModel, setClassificationModel] =
    useState<tf.Sequential | null>(null)
  const [classificationLabels, setClassificationLabels] = useState<string[]>([])
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

  const classify = (keypoints: number[][]) => {
    if (classificationModel === null) return

    const result = tf.tidy(() => {
      const inputs = keypoints
        .map(kp => {
          if (kp[2] < 0.3) {
            return [0, 0]
          }
          return [kp[0], kp[1]]
        })
        .flat()

      const prediction = classificationModel.predict(
        tf.tensor([inputs])
      ) as tf.Tensor
      const probabilities = prediction.dataSync()

      // Find the max probability and index
      let maxIndex = 0
      let maxProb = probabilities[0]

      for (let i = 1; i < probabilities.length; i++) {
        if (probabilities[i] > maxProb) {
          maxProb = probabilities[i]
          maxIndex = i
        }
      }

      return {
        label: classificationLabels[maxIndex],
        confidence: maxProb,
      }
    })

    console.log(result)
  }

  const uploadClassificationModel = (result: {
    labels: string[]
    model: tf.Sequential
  }) => {
    setClassificationLabels(result.labels)
    setClassificationModel(result.model)
  }

  useEffect(() => {
    if (!disable) {
      loadModel()
    }
  }, [])

  return (
    <modelContext.Provider
      value={{
        constants:
          type === 'thunder'
            ? {
                width: MOVENET_THUNDER_INPUT_WIDTH,
                height: MOVENET_THUNDER_INPUT_HEIGHT,
              }
            : {
                width: MOVENET_LIGHTNING_INPUT_WIDTH,
                height: MOVENET_LIGHTNING_INPUT_HEIGHT,
              },
        type,
        model,
        loading,
        classificationModel,
        classificationLabels,
        uploadClassificationModel,
        classify,
      }}
    >
      {children}
    </modelContext.Provider>
  )
}

export function useModel() {
  return useContext(modelContext)
}
