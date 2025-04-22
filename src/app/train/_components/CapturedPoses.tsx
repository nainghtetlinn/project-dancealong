import { Button } from '@/components/ui/button'
import PosesTable from './PosesTable'

import { addPose } from '@/lib/store/_features/poseTrainingSlice'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'

const CapturedPoses = () => {
  const dispatch = useAppDispatch()
  const { poses } = useAppSelector(state => state.training)

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
          // onClick={exportTrainingData}
        >
          Export Data
        </Button>
        <Button
          disabled={poses.length < 2}
          // onClick={trainModel}
        >
          Train
        </Button>
      </div>
    </section>
  )
}

export default CapturedPoses
