import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
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
  isCapturing: boolean
  isRecording: boolean
  setIsRecording: (state: boolean) => void
  addPose: () => void
  removePose: (label: string) => void
  capturePose: (keypoints: number[][]) => void
  startCapturing: (label: string) => void
}

const trainContext = createContext<TrainContext>({
  constants,
  poses: [],
  isCapturing: false,
  isRecording: false,
  setIsRecording: () => {},
  addPose: () => {},
  removePose: () => {},
  capturePose: () => {},
  startCapturing: () => {},
})

export const TrainProvider = ({ children }: { children: React.ReactNode }) => {
  const [poses, setPoses] = useState<TPose[]>([])

  const [isRecording, setIsRecording] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [activeLabel, setActiveLabel] = useState('')

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

  const startCapturing = (label: string) => {
    setActiveLabel(label)
    setIsCapturing(true)
    setTimeout(() => {
      setIsCapturing(false)
    }, 3000)
  }

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

  return (
    <trainContext.Provider
      value={{
        constants,
        poses,
        isCapturing,
        isRecording,
        setIsRecording,
        addPose,
        removePose,
        capturePose,
        startCapturing,
      }}
    >
      {children}
    </trainContext.Provider>
  )
}

export const useTrain = () => useContext(trainContext)
