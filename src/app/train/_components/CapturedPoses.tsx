import { Button } from '@/components/ui/button'
import PosesTable from './PosesTable'
import TrainBtn from './btns/TrainBtn'

import { addPose } from '@/lib/store/_features/poseTrainingSlice'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { exportJSON } from '@/lib/utils'

const CapturedPoses = () => {
  const dispatch = useAppDispatch()
  const { poses, trainingData } = useAppSelector(state => state.training)

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

        <TrainBtn />
      </div>
    </section>
  )
}

export default CapturedPoses
