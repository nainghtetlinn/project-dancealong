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
}

const modelContext = createContext<ModelContext>({
  model: null,
  loading: true,
  type: 'lightning',
  constants: {
    width: MOVENET_LIGHTNING_INPUT_WIDTH,
    height: MOVENET_LIGHTNING_INPUT_HEIGHT,
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
      }}
    >
      {children}
    </modelContext.Provider>
  )
}

export function useModel() {
  return useContext(modelContext)
}
