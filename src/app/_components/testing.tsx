'use client'

import * as tf from '@tensorflow/tfjs'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import useDetection from '@/hooks/useDetection'
import useDraw from '@/hooks/useDraw'

const VIDEO_WIDTH = 640
const VIDEO_HEIGHT = 480

const Testing = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)

  const { draw, clean } = useDraw(canvasRef.current, VIDEO_WIDTH, VIDEO_HEIGHT)
  const { start, stop } = useDetection(videoRef.current, draw)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setMediaStream(stream)
      setIsCameraOn(true)
      console.log('Camera enabled')
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
    }
  }

  useEffect(() => {
    if (isCameraOn) {
      start()
    } else {
      stop()
      clean()
    }
  }, [isCameraOn])

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
      <button
        onClick={() => {
          console.log(tf.memory().numTensors)
        }}
      >
        List
      </button>
    </div>
  )
}

export default Testing
