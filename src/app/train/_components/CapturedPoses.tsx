import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import PosesTable from './PosesTable'

import { addPose } from '@/lib/store/_features/poseTrainingSlice'
import { trainModel } from '@/lib/store/_features/poseTrainingThunk'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { exportJSON } from '@/lib/utils'
import { useModel } from '@/provider/model-provider'

const CapturedPoses = () => {
  const dispatch = useAppDispatch()
  const { poses, trainingData, isTraining } = useAppSelector(
    state => state.training
  )
  const { uploadModel } = useModel()

  return (
    <section className='border rounded p-2 space-y-2'>
      <div className='flex items-center justify-between'>
        <h4 className='font-bold'>Captured Poses</h4>
        <Button
          onClick={() => {
            dispatch(addPose())
          }}
        >
          Add Pose
        </Button>
      </div>

      <PosesTable />

      <div className='flex items-center justify-end gap-2'>
        <Button
          variant='secondary'
          disabled={poses.length < 2}
          onClick={() => exportJSON(trainingData, 'training-data.json')}
        >
          Export Data
        </Button>
        <Button
          disabled={poses.length < 2 || isTraining}
          onClick={async () => {
            const result = await dispatch(trainModel())
            uploadModel(result)
          }}
        >
          Train {isTraining && <Loader2 className='animate-spin' />}
        </Button>
      </div>
    </section>
  )
}

export default CapturedPoses
