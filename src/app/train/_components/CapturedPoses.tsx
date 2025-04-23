import { Button } from '@/components/ui/button'
import PosesTable from './PosesTable'
import ExportBtn from './btns/ExportBtn'
import TrainBtn from './btns/TrainBtn'

import { addPose } from '@/lib/store/_features/poseTrainingSlice'
import { useAppDispatch } from '@/lib/store/hooks'

const CapturedPoses = () => {
  const dispatch = useAppDispatch()

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
        <ExportBtn />
        <TrainBtn />
      </div>
    </section>
  )
}

export default CapturedPoses
