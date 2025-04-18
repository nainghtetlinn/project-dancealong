import React, { createContext, useContext, useRef, useState } from 'react'
import { TPose } from '@/types/pose'

const constants = {
  canvas: {
    width: 640,
    height: 480,
  },
} as const

interface TrainContext {
  constants: typeof constants
  poses: TPose[]
  addPose: () => void
  removePose: (label: string) => void
  capturePose: (label: string, keypoints: number[][]) => void
}

const trainContext = createContext<TrainContext>({
  constants,
  poses: [],
  addPose: () => {},
  removePose: () => {},
  capturePose: () => {},
})

export const TrainProvider = ({ children }: { children: React.ReactNode }) => {
  const [poses, setPoses] = useState<TPose[]>([])

  const trainingDataRef = useRef<{ keypoints: number[][]; label: string }[]>([])

  const addPose = () => {
    setPoses(prev => [
      ...prev,
      { label: 'Pose_' + prev.length, numOfPosesCaptured: 0 },
    ])
  }

  const removePose = (label: string) => {
    setPoses(prev => prev.filter(p => p.label !== label))
    trainingDataRef.current = trainingDataRef.current.filter(
      d => d.label !== label
    )
  }

  const capturePose = (label: string, keypoints: number[][]) => {
    setPoses(prev => {
      const index = prev.findIndex(p => p.label === label)
      if (index !== -1) {
        prev[index].numOfPosesCaptured++
      }
      return prev
    })
    trainingDataRef.current.push({ label, keypoints })
  }

  return (
    <trainContext.Provider
      value={{
        constants,
        poses,
        addPose,
        removePose,
        capturePose,
      }}
    >
      {children}
    </trainContext.Provider>
  )
}

export const useTrain = () => useContext(trainContext)
