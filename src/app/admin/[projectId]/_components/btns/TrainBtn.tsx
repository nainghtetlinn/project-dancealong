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
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import TestModelBtn from './TestModelBtn'

import { createModel } from '@/lib/model'
import { useModel } from '@/provider/model-provider'
import { useState } from 'react'
import { toast } from 'sonner'
import { useTraining } from '../../_lib/trainingContext'

export default function TrainBtn() {
  const { uploadClassificationModel } = useModel()
  const { labels, trainingData } = useTraining()

  const [open, setOpen] = useState(false)
  const [isTraining, setIsTraining] = useState(false)
  const [trained, setTrained] = useState(false)
  const [logs, setLogs] = useState({ num: 0, accuracy: '' })

  // Training options
  const [settings, setSettings] = useState({
    epochs: 10,
    batchSize: 5,
    validationSplit: 0.2,
  })

  const handleTrain = async () => {
    /**
     * Check if all labels have at least some poses captured
     */
    let trainable = true
    labels.forEach(l => {
      if (l.count === 0) trainable = false
    })

    if (!trainable) return toast.error('Not all poses have been captured')

    setIsTraining(true)

    try {
      const result = await createModel(trainingData, {
        ...settings,
        shuffle: true,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            setLogs({ num: epoch + 1, accuracy: logs?.acc.toFixed(4) || '' })
          },
        },
      })
      uploadClassificationModel(result)
      setTrained(true)
    } catch (error: any) {
      toast.error(error.message)
    }

    setIsTraining(false)
  }

  const handleRestart = () => {
    setTrained(false)
  }

  const handleUpdate = (field: string, value: number) => {
    setSettings({ ...settings, [field]: value })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          size='sm'
          variant='secondary'
          disabled={labels.length < 2}
        >
          Train
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new classification model</DialogTitle>
          <DialogDescription>
            Adjust settings before training.
          </DialogDescription>
        </DialogHeader>

        {!isTraining && !trained && (
          <Settings
            settings={settings}
            handleUpdate={handleUpdate}
          />
        )}

        {isTraining && (
          <div className='flex items-center justify-center h-16'>
            <div className='text-center'>
              <h6>Training . . .</h6>
              <p className='text-xs text-muted-foreground'>{`Epoch ${logs.num}/${settings.epochs}: accuracy = ${logs.accuracy}`}</p>
            </div>
          </div>
        )}

        {!isTraining && trained && (
          <div className='flex items-center justify-center h-16'>
            <div className='text-center'>
              <h6>Training completed!</h6>
              <p className='text-xs text-muted-foreground'>{`Accuracy = ${logs.accuracy}`}</p>
            </div>
          </div>
        )}

        <DialogFooter>
          {!isTraining && !trained && (
            <Button onClick={handleTrain}>Start</Button>
          )}
          {!isTraining && trained && (
            <>
              <Button
                size='sm'
                variant='secondary'
                onClick={handleRestart}
              >
                Restart
              </Button>
              <TestModelBtn />
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const Settings = ({
  settings,
  handleUpdate,
}: {
  settings: { epochs: number; batchSize: number; validationSplit: number }
  handleUpdate: (field: string, value: number) => void
}) => {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='epochs'>Epochs ({settings.epochs})</Label>
        <Slider
          id='epochs'
          min={1}
          max={30}
          step={1}
          value={[settings.epochs]}
          onValueChange={e => handleUpdate('epochs', e[0])}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='batchsize'>Batch size ({settings.batchSize})</Label>
        <Slider
          id='batchsize'
          min={1}
          max={30}
          step={1}
          value={[settings.batchSize]}
          onValueChange={e => handleUpdate('batchSize', e[0])}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='validationsplit'>
          Validation split ({settings.validationSplit})
        </Label>
        <Slider
          id='validationsplit'
          min={0.1}
          max={0.4}
          step={0.05}
          value={[settings.validationSplit]}
          onValueChange={e => handleUpdate('validationSplit', e[0])}
        />
      </div>
    </div>
  )
}
