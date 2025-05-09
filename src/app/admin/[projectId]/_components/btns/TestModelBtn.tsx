import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import useDetectAndDraw from '@/hooks/useDetectAndDraw'
import * as tf from '@tensorflow/tfjs'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

const constants = {
  width: 640,
  height: 480,
}

export default function TestModelBtn({
  model,
  labels,
}: {
  model: tf.Sequential | tf.LayersModel | null
  labels: string[]
}) {
  const streamRef = useRef<MediaStream>(null)

  const { videoRef, canvasRef, start, stop } = useDetectAndDraw(
    constants.width,
    constants.height,
    keypoints => {
      if (model === null) return

      tf.tidy(() => {
        const inputs = keypoints
          .map(kp => {
            if (kp[2] < 0.3) {
              return [0, 0]
            }
            return [kp[0], kp[1]]
          })
          .flat()

        const prediction = model.predict(tf.tensor([inputs])) as tf.Tensor
        const probabilities = prediction.dataSync()

        // Find the max probability and index
        let maxIndex = 0
        let maxProb = probabilities[0]

        for (let i = 1; i < probabilities.length; i++) {
          if (probabilities[i] > maxProb) {
            maxProb = probabilities[i]
            maxIndex = i
          }
        }

        setResult({
          label: labels[maxIndex],
          confidence: maxProb,
        })
      })
    }
  )

  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<
    { label: string; confidence: number } | undefined
  >()

  const openWebcam = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setTimeout(start, 1000)
    } catch (error) {
      console.error('Error accessing webcam', error)
      toast.error('Error accessing webcam')
    }
  }

  const closeWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      if (videoRef.current) videoRef.current.srcObject = null
      stop()
      setOpen(false)
    }
  }

  useEffect(() => {
    if (open) openWebcam()
    else closeWebcam()
  }, [open])

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          size='sm'
          disabled={labels.length === 0}
          variant='secondary'
        >
          Test Model
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-none! w-auto'>
        <DialogHeader>
          <DialogTitle>Testing classification model</DialogTitle>
          <DialogDescription>
            This classification model is the model you just created.
          </DialogDescription>
        </DialogHeader>

        <div>
          <h5>
            Label =<span className='font-bold text-3xl'>{result?.label}</span>
          </h5>
          <p>
            Confidence =
            <span className='font-bold text-3xl'>
              {result?.confidence.toFixed(4)}
            </span>
          </p>
        </div>

        <div
          className='relative'
          style={{ width: constants.width, height: constants.height }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            width={constants.width}
            height={constants.height}
            style={{ transform: 'scaleX(-1)' }}
            className='relative'
          />
          <canvas
            ref={canvasRef}
            width={constants.width}
            height={constants.height}
            className='absolute top-0 left-0 z-10'
          />
        </div>

        <DialogFooter>
          <Button
            variant='secondary'
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
