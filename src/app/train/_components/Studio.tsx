import { Switch } from '@/components/ui/switch'
import { Video } from 'lucide-react'
import SongDetails from './SongDetails'
import SongUpload from './SongUpload'

import useDetectAndDraw from '@/hooks/useDetectAndDraw'
import { cn } from '@/lib/utils'
import { useAudio } from '@/provider/audio-provider'
import { useTrain } from '@/provider/train-provider'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

const Studio = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)

  const { constants, isCapturing, isRecording, setIsRecording } = useTrain()
  const { audio, isCounting, count } = useAudio()

  const { start, stop, clean } = useDetectAndDraw(
    videoRef.current,
    canvasRef.current,
    keypoints => {
      console.log(isCapturing)
    }
  )

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setMediaStream(stream)
      setIsRecording(true)
      console.log('Camera enabled')
      start()
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
      setIsRecording(false)
      console.log('Camera disabled')
      stop()
      clean()
    }
  }

  return (
    <div className='h-full'>
      <main className='space-y-2'>
        <section className='flex justify-between items-center'>
          <div className='flex gap-2'>
            <Video
              className={cn(
                isRecording ? 'text-emerald-500' : 'text-destructive'
              )}
            />
            {isRecording ? 'Recording ...' : 'Record'}
          </div>

          <Switch
            checked={isRecording}
            onCheckedChange={state => {
              if (state) {
                startCamera()
              } else {
                stopCamera()
              }
            }}
          />
        </section>

        <section
          style={{
            width: constants.canvas.width,
            height: constants.canvas.height,
          }}
          className='relative rounded overflow-hidden bg-accent'
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            width={constants.canvas.width}
            height={constants.canvas.height}
            style={{ transform: 'scaleX(-1)' }}
            className='relative z-0'
          ></video>
          <canvas
            ref={canvasRef}
            width={constants.canvas.width}
            height={constants.canvas.height}
            className='absolute inset-0 z-10'
          ></canvas>
          {isCounting && (
            <div className='absolute inset-0 z-20 bg-black/40 flex items-center justify-center text-5xl'>
              {count}
            </div>
          )}
        </section>

        {audio !== null ? <SongDetails /> : <SongUpload />}
      </main>
    </div>
  )
}

export default Studio
