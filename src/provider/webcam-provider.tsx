'use client'

import useDetectAndDraw from '@/hooks/useDetectAndDraw'
import { capturePoses } from '@/lib/store/_features/poseTrainingSlice'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import React, { createContext, useContext, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useModel } from './model-provider'

const constants = {
  width: 640,
  height: 480,
} as const

interface WebcamContext {
  constants: typeof constants
  VideoElement: React.JSX.Element
  CanvasElement: React.JSX.Element
  webcamEnable: boolean
  openWebcam: () => void
  closeWebcam: () => void
}

const webcamContext = createContext<WebcamContext>({
  constants,
  VideoElement: <video />,
  CanvasElement: <canvas />,
  webcamEnable: false,
  openWebcam: () => {},
  closeWebcam: () => {},
})

export const WebcamProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch()

  const streamRef = useRef<MediaStream>(null)
  const keypointsRef = useRef<number[][][]>([])

  const { classify } = useModel()

  const [webcamEnable, setWebcamEnable] = useState(false)
  const { isCapturing } = useAppSelector(state => state.training)

  const { videoRef, canvasRef, start, stop } = useDetectAndDraw(
    constants.width,
    constants.height,
    keypoints => {
      if (isCapturing) {
        keypointsRef.current.push(keypoints)
      }

      classify(keypoints)
    }
  )

  const openWebcam = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setWebcamEnable(true)
      setTimeout(start, 1000)
    } catch (error) {
      console.error('Error accessing webcam', error)
      toast.error('Error accessing webcam')
      setWebcamEnable(false)
    }
  }
  const closeWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      if (videoRef.current) videoRef.current.srcObject = null
      stop()
      if (keypointsRef.current.length > 0) {
        // Doesn't need to specifie label because the active label will not be reset after stop capturing
        dispatch(capturePoses(keypointsRef.current))
        keypointsRef.current.length = 0
      }
    }
    setWebcamEnable(false)
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
        webcamEnable,
        openWebcam,
        closeWebcam,
      }}
    >
      {children}
    </webcamContext.Provider>
  )
}

export const useWebcam = () => useContext(webcamContext)
