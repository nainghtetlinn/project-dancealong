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
  accuracy: number
  hasLocalTrained: boolean
  localTrainedModel: tf.Sequential | null
  localTrainedModelLabels: string[]
  hasTrained: boolean
  trainedModel: tf.LayersModel | null
  trainedModelLabels: string[]
  addLabel: () => void
  editLabel: (oldLabel: string, newLabel: string) => void
  removeLabel: (label: string) => void
  importData: (data: TTrainingData) => void
  exportData: () => void
  removePose: (id: string) => void
  addTrainingData: (data: TKeypoints[], label: string) => void
  startTrain: (options: tf.ModelFitArgs) => Promise<void>
  updateAccuracy: (accuracy: number) => void
  restart: () => void
  retrain: () => void
  calcelRetrain: () => void
  saveLocalModel: () => void
}

const trainingContext = createContext<TrainingContext>({
  labels: [],
  trainingData: [],
  accuracy: 0,
  hasLocalTrained: false,
  localTrainedModel: null,
  localTrainedModelLabels: [],
  hasTrained: false,
  trainedModel: null,
  trainedModelLabels: [],
  addLabel: () => {},
  editLabel: () => {},
  removeLabel: () => {},
  importData: () => {},
  exportData: () => {},
  removePose: () => {},
  addTrainingData: () => {},
  startTrain: async () => {},
  updateAccuracy: () => {},
  restart: () => {},
  retrain: () => {},
  calcelRetrain: () => {},
  saveLocalModel: () => {},
})

export const TrainingProvider = ({
  children,
  model,
}: {
  children: React.ReactNode
  model: TModel | null
}) => {
  const hasLoadedModel = useRef(false)

  // training data for tensorflow
  const trainingDataRef = useRef<TTrainingData>([])
  const [labels, setLabels] = useState<TLabel[]>([])

  // Fetched model from url
  const [hasTrained, setHasTrained] = useState(false)
  const [trainedModel, setTrainedModel] = useState<tf.LayersModel | null>(null)
  const [trainedModelLabels, setTrainedModelLabels] = useState<string[]>([])

  // Local trained model
  const [accuracy, setAccuracy] = useState(0)
  const [hasLocalTrained, setHasLocalTrained] = useState(false)
  const [localTrainedModel, setLocalTrainedModel] =
    useState<tf.Sequential | null>(null)
  const [localTrainedModelLabels, setLocalTrainedModelLabels] = useState<
    string[]
  >([])

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
    setLocalTrainedModel(result.model)
    setLocalTrainedModelLabels(result.labels)
    setHasLocalTrained(true)
  }

  const updateAccuracy = (a: number) => {
    setAccuracy(a)
  }

  // Call this function if we don't like the accuracy of the local trained model and want to restart the training with different settings
  const restart = () => {
    setHasLocalTrained(false)
  }

  // Call this function if there is uploaded model and want to update the model
  const retrain = () => {
    setHasTrained(false)
  }

  const calcelRetrain = () => {
    setHasTrained(true)
  }

  const saveLocalModel = () => {
    setTrainedModel(localTrainedModel)
    setTrainedModelLabels(localTrainedModelLabels)
    setHasTrained(true)
    setLocalTrainedModel(null)
    setLocalTrainedModelLabels([])
    setHasLocalTrained(false)
    setAccuracy(0)
  }

  if (model && !hasLoadedModel.current) {
    hasLoadedModel.current = true
    tf.loadLayersModel(model.model_url).then(m => {
      setTrainedModel(m)
      setTrainedModelLabels(model.labels)
      setHasTrained(true)
    })
  } else if (!hasLoadedModel.current) {
    hasLoadedModel.current = true
  }

  return (
    <trainingContext.Provider
      value={{
        labels,
        trainingData: trainingDataRef.current,
        accuracy,
        hasLocalTrained,
        localTrainedModel,
        localTrainedModelLabels,
        hasTrained,
        trainedModel,
        trainedModelLabels,
        addLabel,
        editLabel,
        removeLabel,
        importData,
        exportData,
        removePose,
        addTrainingData,
        startTrain,
        updateAccuracy,
        restart,
        retrain,
        calcelRetrain,
        saveLocalModel,
      }}
    >
      {children}
    </trainingContext.Provider>
  )
}

export const useTraining = () => useContext(trainingContext)
