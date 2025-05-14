'use client'

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import RecordBtn from './btns/choreography/RecordBtn'
import PlayBtn from './btns/choreography/PlayBtn'
import UploadBtn from './btns/choreography/UploadBtn'
import ReshootBtn from './btns/choreography/ReshootBtn'

import { type TKeypoints, type TParsedChoreography } from '@/types'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import useDetectAndDraw from '@/hooks/useDetectAndDraw'
import { useModel } from '@/provider/model-provider'
import { useAudio } from '../_lib/audioContext'

const constants = {
  width: 640,
  height: 480,
} as const

export default function RecordChoreography({
  choreography,
}: {
  choreography: TParsedChoreography[]
}) {
  const streamRef = useRef<MediaStream>(null)
  const choreographyRef = useRef<
    { keypoints: TKeypoints; timestamp: number }[]
  >([])
  const startTimeRef = useRef(0)
  const isAudioPlayingRef = useRef(false)

  const [uploadedChoreography, setUploadedChoreography] = useState(choreography)
  const [hasUploaded, setHasUploaded] = useState(choreography.length > 0)
  const [count, setCount] = useState(0)
  const [isWebcamEnable, setIsWebcamEnable] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)

  const { model } = useModel()
  const { isPlaying, restart, play } = useAudio()
  const { videoRef, canvasRef, start, stop, draw, clean } = useDetectAndDraw(
    constants.width,
    constants.height,
    keypoints => {
      if (isCapturing) {
        if (!startTimeRef.current) startTimeRef.current = new Date().getTime()

        if (isAudioPlayingRef.current) {
          let currentTime = new Date().getTime()
          choreographyRef.current.push({
            keypoints,
            timestamp: currentTime - startTimeRef.current,
          })
        } else {
          // when audio stop, capturing stop
          setIsCapturing(false)
          closeWebcam()
        }
      }
    }
  )

  useEffect(() => {
    isAudioPlayingRef.current = isPlaying
  }, [isPlaying])

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

  const handleRecord = async () => {
    if (model === null) return

    choreographyRef.current = []
    restart() // restart the audio

    await openWebcam()

    for (let i = 0; i <= 5; i++) {
      setCount(5 - i)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    play()
    setIsCapturing(true)
  }

  return (
    <div className='p-2 space-y-2'>
      <div
        style={{ ...constants }}
        className='relative border rounded overflow-hidden mx-auto'
      >
        {count > 0 && (
          <div className='absolute z-10 inset-0 bg-black/60 flex items-center justify-center pointer-events-none'>
            <span className='text-4xl font-bold'>{count}</span>
          </div>
        )}
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{ ...constants, transform: 'scaleX(-1)' }}
        />
        <canvas
          ref={canvasRef}
          className='absolute top-0 left-0 z-10'
        />
      </div>

      <div
        style={{ width: constants.width }}
        className='mx-auto flex items-center justify-between gap-2'
      >
        <div className='space-x-2'>
          {!hasUploaded && <RecordBtn onClick={handleRecord} />}
          {!hasUploaded && (
            <UploadBtn
              choreography={choreographyRef.current}
              onSuccess={data => {
                setUploadedChoreography(data)
                setHasUploaded(true)
              }}
            />
          )}
          {hasUploaded && <ReshootBtn onClick={() => setHasUploaded(false)} />}
        </div>
        <PlayBtn
          choreography={
            hasUploaded ? uploadedChoreography : choreographyRef.current
          }
          draw={draw}
          clean={clean}
          disabled={isWebcamEnable}
        />
      </div>

      {uploadedChoreography.length > 0 && (
        <Alert
          style={{ width: constants.width }}
          className='mx-auto'
        >
          <AlertCircle />
          <AlertTitle>You've uploaded choreography.</AlertTitle>
          <AlertDescription>
            Or you can upload it again if you've taken new choreography and want
            to update it. Be careful, old choreography will be deleted.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
