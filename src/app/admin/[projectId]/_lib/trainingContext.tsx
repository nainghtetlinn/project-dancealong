'use client'

import { TKeypoints, TLabel, TModel, TTrainingData } from '../../_types'

import { createModel } from '@/lib/model'
import { exportJSON } from '@/lib/utils'
import * as tf from '@tensorflow/tfjs'
import React, { createContext, useContext, useRef, useState } from 'react'
import ShortUniqueID from 'short-unique-id'

const uid = new ShortUniqueID({ length: 6 })

interface TrainingContext {
  labels: TLabel[]
  trainingData: TTrainingData
  trainedModel: tf.Sequential | tf.LayersModel | null
  trainedModelLabels: string[]
  hasTrained: boolean
  addLabel: () => void
  editLabel: (oldLabel: string, newLabel: string) => void
  removeLabel: (label: string) => void
  importData: (data: TTrainingData) => void
  exportData: () => void
  removePose: (id: string) => void
  addTrainingData: (data: TKeypoints[], label: string) => void
  startTrain: (options: tf.ModelFitArgs) => Promise<void>
  restart: () => void
  classify: (
    keypoints: TKeypoints
  ) => { label: string; confidence: number } | undefined
}

const trainingContext = createContext<TrainingContext>({
  labels: [],
  trainingData: [],
  trainedModel: null,
  trainedModelLabels: [],
  hasTrained: false,
  addLabel: () => {},
  editLabel: () => {},
  removeLabel: () => {},
  importData: () => {},
  exportData: () => {},
  removePose: () => {},
  addTrainingData: () => {},
  startTrain: async () => {},
  restart: () => {},
  classify: () => {
    return undefined
  },
})

export const TrainingProvider = ({
  children,
  model,
}: {
  children: React.ReactNode
  model: TModel | null
}) => {
  const hasLoadedModel = useRef(false)
  const trainingDataRef = useRef<TTrainingData>([])

  const [labels, setLabels] = useState<TLabel[]>([])
  const [hasTrained, setHasTrained] = useState(false)
  const [trainedModel, setTrainedModel] = useState<
    tf.Sequential | tf.LayersModel | null
  >(null)
  const [trainedModelLabels, setTrainedModelLabels] = useState<string[]>([])

  const addLabel = () => {
    setLabels([...labels, { name: 'Pose_' + uid.rnd(), count: 0 }])
  }

  const editLabel = (oldLabel: string, newLabel: string) => {
    const updatedLabels = labels.map(l => {
      if (l.name === oldLabel) {
        l.name = newLabel
      }
      return l
    })
    setLabels(updatedLabels)
    trainingDataRef.current.forEach(d => {
      if (d.label === oldLabel) {
        d.label = newLabel
      }
    })
  }

  const removeLabel = (label: string) => {
    const updatedLabels = labels.filter(p => p.name !== label)
    setLabels(updatedLabels)
    trainingDataRef.current = trainingDataRef.current.filter(
      d => d.label !== label
    )
  }

  const exportData = () => {
    exportJSON(trainingDataRef.current, 'training-data.json')
  }

  const importData = (data: TTrainingData) => {
    const labelsToImport: TLabel[] = []

    data.forEach(pose => {
      const existingLabel = labelsToImport.find(l => l.name === pose.label)

      if (existingLabel) {
        existingLabel.count += 1
      } else {
        labelsToImport.push({
          name: pose.label,
          count: 1,
        })
      }
    })

    setLabels(labelsToImport)
    trainingDataRef.current = data
  }

  const removePose = (id: string) => {
    let label: string = ''

    trainingDataRef.current = trainingDataRef.current.filter(d => {
      if (d.id === id) label = d.label
      return d.id !== id
    })

    const updatedLabels = labels.map(l => {
      if (l.name === label) {
        l.count -= 1
      }
      return l
    })

    setLabels(updatedLabels)
  }

  const addTrainingData = (data: TKeypoints[], label: string) => {
    const updatedLabels = labels.map(l => {
      if (l.name === label) {
        l.count += data.length
      }
      return l
    })
    setLabels(updatedLabels)
    data.forEach(d => {
      trainingDataRef.current.push({ id: uid.rnd(), label, keypoints: d })
    })
  }

  const startTrain = async (options: tf.ModelFitArgs): Promise<void> => {
    const result = await createModel(trainingDataRef.current, options)
    setTrainedModel(result.model)
    setTrainedModelLabels(result.labels)
    setHasTrained(true)
  }

  const restart = () => {
    setHasTrained(false)
  }

  const classify = (keypoints: TKeypoints) => {
    if (trainedModel === null) return undefined

    return tf.tidy(() => {
      const inputs = keypoints
        .map(kp => {
          if (kp[2] < 0.3) {
            return [0, 0]
          }
          return [kp[0], kp[1]]
        })
        .flat()

      const prediction = trainedModel.predict(tf.tensor([inputs])) as tf.Tensor
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
        label: trainedModelLabels[maxIndex],
        confidence: maxProb,
      }
    })
  }

  if (model && !hasLoadedModel.current) {
    hasLoadedModel.current = true
    tf.loadLayersModel(model.model_url)
      .then(m => {
        setTrainedModel(m)
        setTrainedModelLabels(model.labels)
        const ls = model.labels.map(l => ({ name: l, count: 0 }))
        setLabels(ls)
      })
      .finally()
  } else if (!hasLoadedModel.current) {
    hasLoadedModel.current = true
  }

  return (
    <trainingContext.Provider
      value={{
        labels,
        trainingData: trainingDataRef.current,
        trainedModel,
        trainedModelLabels,
        hasTrained,
        addLabel,
        editLabel,
        removeLabel,
        importData,
        exportData,
        removePose,
        addTrainingData,
        startTrain,
        restart,
        classify,
      }}
    >
      {children}
    </trainingContext.Provider>
  )
}

export const useTraining = () => useContext(trainingContext)
