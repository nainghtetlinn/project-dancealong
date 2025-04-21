'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { TPose } from '@/types/pose'
import { exportJSON } from '@/lib/utils'
import ShortUniqueID from 'short-unique-id'
import { createModel } from '@/lib/model'
import * as tf from '@tensorflow/tfjs'

const uid = new ShortUniqueID({ length: 4 })

const constants = {
  canvas: {
    width: 640,
    height: 480,
  },
} as const

interface TrainContext {
  constants: typeof constants
  poses: TPose[]
  count: number
  isCounting: boolean
  isCapturing: boolean
  isRecording: boolean
  setIsRecording: (state: boolean) => void
  addPose: () => void
  removePose: (label: string) => void
  editPose: (label: string, newLabel: string) => void
  capturePose: (keypoints: number[][]) => void
  startCapturing: (label: string) => void
  exportTrainingData: () => void
  trainModel: () => void
}

const trainContext = createContext<TrainContext>({
  constants,
  poses: [],
  count: 5,
  isCounting: false,
  isCapturing: false,
  isRecording: false,
  setIsRecording: () => {},
  addPose: () => {},
  removePose: () => {},
  editPose: () => {},
  capturePose: () => {},
  startCapturing: () => {},
  exportTrainingData: () => {},
  trainModel: () => {},
})

export const TrainProvider = ({ children }: { children: React.ReactNode }) => {
  const [trainedModel, setTrainedModel] = useState<tf.Sequential>()
  const [trainedModelLabels, setTrainedModelLabels] = useState<string[]>()

  const [poses, setPoses] = useState<TPose[]>([])

  const [isRecording, setIsRecording] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isCounting, setIsCounting] = useState(false)
  const [count, setCount] = useState(5)
  const [activeLabel, setActiveLabel] = useState('')

  const trainingDataRef = useRef<{ keypoints: number[][]; label: string }[]>([])

  const addPose = () => {
    setPoses(prev => [
      ...prev,
      { label: 'Pose_' + uid.rnd(), numOfPosesCaptured: 0 },
    ])
  }

  const removePose = (label: string) => {
    setPoses(prev => prev.filter(p => p.label !== label))
    trainingDataRef.current = trainingDataRef.current.filter(
      d => d.label !== label
    )
  }

  const editPose = (label: string, newLabel: string) => {
    setPoses(prev => {
      return prev.map(p => {
        if (p.label === label) {
          return { ...p, label: newLabel }
        }
        return p
      })
    })
    trainingDataRef.current = trainingDataRef.current.map(d => {
      if (d.label === label) {
        return { ...d, label: newLabel }
      }
      return d
    })
  }

  const startCapturing = (label: string) => {
    setIsCounting(true)
    setActiveLabel(label)
  }

  useEffect(() => {
    if (!isCounting) return

    if (count === 0) {
      setCount(5)
      setIsCounting(false)
      setIsCapturing(true)
      setTimeout(() => {
        setIsCapturing(false)
      }, 3000)
    }

    const timer = setTimeout(() => {
      setCount(prev => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isCounting, count])

  const capturePose = (keypoints: number[][]) => {
    if (!isCapturing) return

    setPoses(prev =>
      prev.map(p => {
        if (p.label === activeLabel) {
          return {
            ...p,
            numOfPosesCaptured: p.numOfPosesCaptured + 1,
          }
        }
        return p
      })
    )
    trainingDataRef.current.push({ label: activeLabel, keypoints })
  }

  const exportTrainingData = () => {
    exportJSON(trainingDataRef.current, 'training_data.json')
  }

  const trainModel = async () => {
    const { labels, model } = await createModel(trainingDataRef.current)

    setTrainedModel(model)
    setTrainedModelLabels(labels)
  }

  return (
    <trainContext.Provider
      value={{
        constants,
        poses,
        count,
        isCounting,
        isCapturing,
        isRecording,
        setIsRecording,
        addPose,
        removePose,
        editPose,
        capturePose,
        startCapturing,
        exportTrainingData,
        trainModel,
      }}
    >
      {children}
    </trainContext.Provider>
  )
}

export const useTrain = () => useContext(trainContext)
