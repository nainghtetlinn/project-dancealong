import { Switch } from '@/components/ui/switch'
import { Video } from 'lucide-react'

import useDetection from '@/hooks/useDetection'
import useDraw from '@/hooks/useDraw'
import { cn } from '@/lib/utils'
import { useAudio } from '@/provider/audio-provider'
import { useTrain } from '@/provider/train-provider'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

const Studio = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  const { constants } = useTrain()
  const { isCounting, count } = useAudio()
  const { draw, clean } = useDraw(
    canvasRef.current,
    constants.canvas.width,
    constants.canvas.height
  )
  const { start, stop } = useDetection(videoRef.current, draw)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setMediaStream(stream)
      setIsRecording(true)
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
      setIsRecording(false)
      console.log('Camera disabled')
    }
  }

  useEffect(() => {
    if (isRecording) {
      startCamera()
      start()
    } else {
      stopCamera()
      stop()
      clean()
    }
  }, [isRecording])

  return (
    <div className='h-full flex justify-center'>
      <main className='pt-1'>
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
            onCheckedChange={setIsRecording}
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
      </main>
    </div>
  )
}

export default Studio
