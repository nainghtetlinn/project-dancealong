'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'

import useDetection from '@/hooks/useDetection'

const VIDEO_WIDTH = 640
const VIDEO_HEIGHT = 480

const Testing = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)

  const { detect, stop } = useDetection(videoRef.current, keypoints => {
    console.log(keypoints[0])
  })

  const cleanCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setMediaStream(stream)
      setIsCameraOn(true)
      console.log('Camera enabled')
      detect()
    } catch (error) {
      console.error('Error accessing webcam', error)
      toast.error('Error accessing webcam')
    }
  }

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop())
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      setMediaStream(null)
      setIsCameraOn(false)
      console.log('Camera disabled')
      stop()

      cleanCanvas()
    }
  }

  const drawKeypoints = (
    keypoints: number[][],
    width: number,
    height: number
  ) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, width, height)

    keypoints.forEach(([y, x, score]) => {
      if (score > 0.3) {
        const mirroredX = 1 - x // Mirror the x-coordinate (since x is normalized 0 to 1)
        ctx.beginPath()
        ctx.arc(mirroredX * width, y * height, 5, 0, 2 * Math.PI)
        ctx.fillStyle = 'red'
        ctx.fill()
      }
    })
  }

  return (
    <div>
      <div className='relative w-[640px] h-[480px]'>
        <video
          ref={videoRef}
          autoPlay
          muted
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          className='h-full w-full mx-auto'
          style={{ transform: 'scaleX(-1)' }}
        />
        <canvas
          ref={canvasRef}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          className='absolute inset-0'
        ></canvas>
      </div>
      <button onClick={() => (isCameraOn ? stopCamera() : startCamera())}>
        {isCameraOn ? 'Stop Camera' : 'Start Camera'}
      </button>
    </div>
  )
}

export default Testing
