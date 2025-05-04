'use client'

import { Keypoints } from '@/types'

import useDetectAndDraw from '@/hooks/useDetectAndDraw'
import React, { createContext, useContext, useRef, useState } from 'react'
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
  openWebcam: () => void
  closeWebcam: () => void
  registerCallback: (callback: (keypoints: Keypoints) => void) => void
}

const webcamContext = createContext<WebcamContext>({
  constants,
  VideoElement: <video />,
  CanvasElement: <canvas />,
  isWebcamEnable: false,
  openWebcam: () => {},
  closeWebcam: () => {},
  registerCallback: () => {},
})

export const WebcamProvider = ({ children }: { children: React.ReactNode }) => {
  const streamRef = useRef<MediaStream>(null)
  const keypointsRef = useRef<Keypoints[]>([])
  const callbackRef = useRef<(keypoints: Keypoints) => void>(keypoints => {
    console.log('Detected')
  })

  const [isWebcamEnable, setIsWebcamEnable] = useState(false)

  const { videoRef, canvasRef, start, stop } = useDetectAndDraw(
    constants.width,
    constants.height,
    keypoints => {
      callbackRef.current(keypoints)
    }
  )

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
      if (keypointsRef.current.length > 0) {
        keypointsRef.current.length = 0
      }
    }
    setIsWebcamEnable(false)
  }

  const registerCallback = (callback: (keypoints: Keypoints) => void) => {
    callbackRef.current = callback
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
        openWebcam,
        closeWebcam,
        registerCallback,
      }}
    >
      {children}
    </webcamContext.Provider>
  )
}

export const useWebcam = () => useContext(webcamContext)
