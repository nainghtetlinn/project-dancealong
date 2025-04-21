'use client'

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
  webcamEnable: boolean
  toggleWebcam: () => void
}

const webcamContext = createContext<WebcamContext>({
  constants,
  VideoElement: <video />,
  CanvasElement: <canvas />,
  webcamEnable: false,
  toggleWebcam: () => {},
})

export const WebcamProvider = ({ children }: { children: React.ReactNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream>(null)

  const [webcamEnable, setWebcamEnable] = useState(false)

  const { start, stop } = useDetectAndDraw(
    videoRef.current,
    canvasRef.current,
    keypoints => {}
  )

  useEffect(() => {
    if (webcamEnable) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          streamRef.current = stream
          if (videoRef.current) videoRef.current.srcObject = stream
          start()
        })
        .catch(error => {
          console.error('Error accessing webcam', error)
          toast.error('Error accessing webcam')
        })
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
        if (videoRef.current) videoRef.current.srcObject = null
        stop()
      }
    }
  }, [webcamEnable])

  const toggleWebcam = () => {
    setWebcamEnable(!webcamEnable)
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
        toggleWebcam,
      }}
    >
      {children}
    </webcamContext.Provider>
  )
}

export const useWebcam = () => useContext(webcamContext)
