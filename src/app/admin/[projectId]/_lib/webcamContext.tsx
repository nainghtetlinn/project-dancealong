'use client'

import { TKeypoints } from '../../_types'

import useDetectAndDraw from '@/hooks/useDetectAndDraw'
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { toast } from 'sonner'

const constants = {
  width: 640,
  height: 480,
} as const

interface WebcamContext {
  constants: typeof constants
  VideoElement: React.JSX.Element
  CanvasElement: React.JSX.Element
  isWebcamEnable: boolean
  isCapturing: boolean
  count: number
  openWebcam: () => void
  closeWebcam: () => void
  startCapturing: () => Promise<TKeypoints[]>
}

const webcamContext = createContext<WebcamContext>({
  constants,
  VideoElement: <video />,
  CanvasElement: <canvas />,
  isWebcamEnable: false,
  isCapturing: false,
  count: 0,
  openWebcam: () => {},
  closeWebcam: () => {},
  startCapturing: () => {
    return Promise.resolve([])
  },
})

export const WebcamProvider = ({ children }: { children: React.ReactNode }) => {
  const streamRef = useRef<MediaStream>(null)
  const keypointsRef = useRef<TKeypoints[]>([])

  const [count, setCount] = useState(0)
  const [isWebcamEnable, setIsWebcamEnable] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)

  const { videoRef, canvasRef, start, stop } = useDetectAndDraw(
    constants.width,
    constants.height,
    keypoints => {
      if (isCapturing) {
        keypointsRef.current.push(keypoints)
      }
    }
  )

  const startCapturing = async (): Promise<TKeypoints[]> => {
    await openWebcam()

    for (let i = 0; i <= 5; i++) {
      setCount(5 - i)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    setIsCapturing(true)

    for (let i = 0; i <= 3; i++) {
      setCount(3 - i)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    setIsCapturing(false)
    closeWebcam()

    let result: TKeypoints[] = []
    if (keypointsRef.current.length > 0) {
      result = keypointsRef.current
      keypointsRef.current = []
    }
    return result
  }

  const openWebcam = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setIsWebcamEnable(true)
      setTimeout(start, 1000)
    } catch (error) {
      console.error('Error accessing webcam', error)
      toast.error('Error accessing webcam')
      setIsWebcamEnable(false)
    }
  }
  const closeWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      if (videoRef.current) videoRef.current.srcObject = null
      stop()
    }
    setIsWebcamEnable(false)
  }

  const VideoElement = (
    <video
      ref={videoRef}
      autoPlay
      muted
      width={constants.width}
      height={constants.height}
      style={{ transform: 'scaleX(-1)' }}
      className='relative'
    />
  )

  const CanvasElement = (
    <canvas
      ref={canvasRef}
      width={constants.width}
      height={constants.height}
      className='relative'
    />
  )

  return (
    <webcamContext.Provider
      value={{
        constants,
        VideoElement,
        CanvasElement,
        isWebcamEnable,
        isCapturing,
        count,
        openWebcam,
        closeWebcam,
        startCapturing,
      }}
    >
      {children}
    </webcamContext.Provider>
  )
}

export const useWebcam = () => useContext(webcamContext)
