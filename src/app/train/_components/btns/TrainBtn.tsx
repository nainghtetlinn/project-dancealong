import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Loader2 } from 'lucide-react'

import { trainModel } from '@/lib/store/_features/poseTrainingThunk'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { useModel } from '@/provider/model-provider'
import { useWebcam } from '@/provider/webcam-provider'
import { useState } from 'react'
import { toast } from 'sonner'

const TrainBtn = () => {
  const dispatch = useAppDispatch()
  const { isTraining, poses } = useAppSelector(state => state.training)
  const { uploadClassificationModel } = useModel()
  const { closeWebcam } = useWebcam()

  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  // Training options
  const [epochs, setEpochs] = useState('30')
  const [batchSize, setBatchSize] = useState('5')
  const [validationSplit, setValidationSplit] = useState(0.2)
  const [shuffle, setShuffle] = useState(true)

  const handleTrain = async () => {
    /**
     * Check if all labels have at least some poses captured
     */
    let trainable = true
    poses.forEach(pose => {
      if (pose.numOfPosesCaptured === 0) trainable = false
    })

    if (!trainable) return toast.error('Not all poses have been captured')

    // Close webcam for better performance
    closeWebcam()

    try {
      const result = await dispatch(
        trainModel({
          epochs: parseInt(epochs) || 30,
          batchSize: parseInt(batchSize) || 5,
          validationSplit,
          shuffle,
          callbacks: {
            onEpochEnd: (epoch, logs) => {
              setMessage(
                `Epoch ${epoch + 1}/${epochs}: accuracy = ${logs?.acc.toFixed(
                  4
                )}`
              )
            },
          },
        })
      )
      uploadClassificationModel(result)
      toast.success('Model trained successfully')
      setOpen(false)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button disabled={poses.length < 2}>Train</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Training options</DialogTitle>
          <DialogDescription>Click save to start training.</DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='epochs'>Epochs</Label>
            <Input
              id='epochs'
              disabled={isTraining}
              value={epochs}
              onChange={e => setEpochs(e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='batchsize'>Batch size</Label>
            <Input
              id='batchsize'
              disabled={isTraining}
              value={batchSize}
              onChange={e => setBatchSize(e.target.value)}
            />
          </div>
          <div className='flex items-center gap-2'>
            <Label
              htmlFor='validationsplit'
              className='shrink-0'
            >
              Validation split: {validationSplit}
            </Label>
            <Slider
              id='validationsplit'
              disabled={isTraining}
              min={0.1}
              max={0.4}
              step={0.01}
              value={[validationSplit]}
              onValueChange={e => setValidationSplit(e[0])}
            />
          </div>
          <div className='flex items-center gap-2'>
            <Label htmlFor='shuffle'>Shuffle</Label>
            <Checkbox
              id='shuffle'
              disabled={isTraining}
              checked={shuffle}
              onCheckedChange={e => {
                setShuffle(e as boolean)
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <div className='w-full flex justify-between items-center'>
            <p className='text-sm text-muted-foreground'>{message}</p>
            <Button
              disabled={isTraining}
              onClick={handleTrain}
            >
              Save {isTraining && <Loader2 className='animate-spin' />}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TrainBtn
