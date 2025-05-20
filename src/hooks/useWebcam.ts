'use client'

import { useEffect, useRef, useState } from 'react'

const useWebcam = (width: number, height: number) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream>(null)

  const [isEnable, setIsEnable] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (!videoRef.current) return
    const video = videoRef.current
    video.width = width
    video.height = height
  }, [])

  const enable = async (): Promise<void> => {
    setIsEnable(false)
    setIsError(false)
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: width },
          height: { ideal: height },
        },
      })
      if (videoRef.current) videoRef.current.srcObject = streamRef.current
      setIsEnable(true)
      setIsError(false)
    } catch (error) {
      setIsEnable(false)
      setIsError(true)
    }
  }

  const disable = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      if (videoRef.current) videoRef.current.srcObject = null
      setIsEnable(false)
      setIsError(false)
    }
  }

  return { videoRef, isEnable, isError, enable, disable }
}

export default useWebcam
