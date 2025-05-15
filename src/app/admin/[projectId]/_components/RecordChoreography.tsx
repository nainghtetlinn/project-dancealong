'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import PlayBtn from './btns/choreography/PlayBtn'
import RecordBtn from './btns/choreography/RecordBtn'
import ReshootBtn from './btns/choreography/ReshootBtn'
import UploadBtn from './btns/choreography/UploadBtn'

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
  const choreographyRef = useRef<
    { keypoints: TKeypoints; timestamp: number }[]
  >([])
  const startTimeRef = useRef(0)

  const [uploadedChoreography, setUploadedChoreography] = useState(choreography)
  const [hasUploaded, setHasUploaded] = useState(choreography.length > 0)
  const [count, setCount] = useState(0)
  const [isCapturing, setIsCapturing] = useState(false)

  const { model } = useModel()
  const { isPlaying, restart, play } = useAudio()

  const {
    videoRef,
    canvasRef,
    isWebcamEnable,
    isWebcamError,
    isDetecting,
    startDetection,
    stopDetection,
    draw,
    clean,
  } = useDetectAndDraw(constants.width, constants.height, keypoints => {
    if (isCapturing) {
      if (!startTimeRef.current) startTimeRef.current = new Date().getTime()
      if (isPlaying) {
        let currentTime = new Date().getTime()
        choreographyRef.current.push({
          keypoints,
          timestamp: currentTime - startTimeRef.current,
        })
      } else {
        // when audio stop, capturing stop
        setIsCapturing(false)
        stopDetection()
      }
    }
  })

  useEffect(() => {
    if (isWebcamError) toast.error('Error accessing webcam.')
  }, [isWebcamError])

  const handleRecord = async () => {
    if (model === null) return
    choreographyRef.current = []
    restart() // restart the audio
    await startDetection()
    for (let i = 5; i >= 0; i--) {
      setCount(i)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    play() // play audio
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
          {!hasUploaded && (
            <RecordBtn
              disabled={isDetecting}
              onClick={handleRecord}
            />
          )}
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
