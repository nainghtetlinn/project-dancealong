'use client'

import * as tf from '@tensorflow/tfjs'
import React, { createContext, useContext, useEffect, useState } from 'react'

const modelUri = '/movenet-tfjs-singlepose-lightning-v4/model.json'

const modelContext = createContext<{
  model: tf.GraphModel | null
}>({
  model: null,
})

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState<tf.GraphModel | null>(null)

  const loadModel = async () => {
    await tf.setBackend('webgl')
    await tf.ready()
    const m = await tf.loadGraphModel(modelUri)
    setModel(m)
    console.log('Model loaded')
  }

  useEffect(() => {
    loadModel()
  }, [])

  return (
    <modelContext.Provider value={{ model }}>{children}</modelContext.Provider>
  )
}

export function useModel() {
  return useContext(modelContext)
}
