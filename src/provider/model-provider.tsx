'use client'

import * as tf from '@tensorflow/tfjs'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

const modelUri = '/movenet-tfjs-singlepose-lightning-v4/model.json'
const MOVENET_INPUT_WIDTH = 192
const MOVENET_INPUT_HEIGHT = 192

const modelContext = createContext<{
  loading: boolean
  model: tf.GraphModel | null
}>({ model: null, loading: true })

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState<tf.GraphModel | null>(null)
  const [loading, setLoading] = useState(true)

  const loadModel = async () => {
    try {
      setLoading(true)

      await tf.setBackend('webgl')
      await tf.ready()
      const m = await tf.loadGraphModel(modelUri)
      setModel(m)
      console.log('Model loaded')

      // Warm up the model by passing zeros through it once
      tf.tidy(() => {
        const answer = m.execute(
          tf.zeros([1, MOVENET_INPUT_HEIGHT, MOVENET_INPUT_WIDTH, 3]).toInt()
        ) as tf.Tensor
        console.log('Warm up ', answer.squeeze().arraySync())
      })
    } catch (error) {
      console.error('Error loading model:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadModel()
  }, [])

  return (
    <modelContext.Provider value={{ model, loading }}>
      {children}
    </modelContext.Provider>
  )
}

export function useModel() {
  return useContext(modelContext)
}
