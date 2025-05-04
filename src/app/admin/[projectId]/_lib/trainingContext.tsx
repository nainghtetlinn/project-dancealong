'use client'

import { TLabel, TTrainingData } from '../../_types'

import { exportJSON } from '@/lib/utils'
import React, { createContext, useContext, useRef, useState } from 'react'
import ShortUniqueID from 'short-unique-id'

const uid = new ShortUniqueID({ length: 6 })

interface TrainingContext {
  labels: TLabel[]
  trainingData: TTrainingData
  addLabel: () => void
  editLabel: (oldLabel: string, newLabel: string) => void
  removeLabel: (label: string) => void
  importData: (data: TTrainingData) => void
  exportData: () => void
  removePose: (id: string) => void
}

const trainingContext = createContext<TrainingContext>({
  labels: [],
  trainingData: [],
  addLabel: () => {},
  editLabel: () => {},
  removeLabel: () => {},
  importData: () => {},
  exportData: () => {},
  removePose: () => {},
})

export const TrainingProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const trainingDataRef = useRef<TTrainingData>([])

  const [labels, setLabels] = useState<TLabel[]>([])

  const addLabel = () => {
    setLabels([...labels, { name: 'Pose_' + uid.rnd(), count: 0 }])
  }

  const editLabel = (oldLabel: string, newLabel: string) => {
    setLabels(prev =>
      prev.map(l => {
        if (l.name === oldLabel) {
          l.name = newLabel
        }
        return l
      })
    )
    trainingDataRef.current.forEach(d => {
      if (d.label === oldLabel) {
        d.label = newLabel
      }
    })
  }

  const removeLabel = (label: string) => {
    setLabels(prev => prev.filter(p => p.name !== label))
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

    const newLabels = labels.map(l => {
      if (l.name === label) {
        l.count -= 1
      }
      return l
    })

    setLabels(newLabels)
  }

  return (
    <trainingContext.Provider
      value={{
        labels,
        trainingData: trainingDataRef.current,
        addLabel,
        editLabel,
        removeLabel,
        importData,
        exportData,
        removePose,
      }}
    >
      {children}
    </trainingContext.Provider>
  )
}

export const useTraining = () => useContext(trainingContext)
