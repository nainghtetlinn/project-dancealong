import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { TPose } from '@/types/pose'
import { exportJSON } from '@/lib/utils'

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
  capturePose: (keypoints: number[][]) => void
  startCapturing: (label: string) => void
  exportTrainingData: () => void
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
  capturePose: () => {},
  startCapturing: () => {},
  exportTrainingData: () => {},
})

export const TrainProvider = ({ children }: { children: React.ReactNode }) => {
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
        capturePose,
        startCapturing,
        exportTrainingData,
      }}
    >
      {children}
    </trainContext.Provider>
  )
}

export const useTrain = () => useContext(trainContext)
