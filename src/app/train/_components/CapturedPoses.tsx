import { Button } from '@/components/ui/button'
import PosesTable from './PosesTable'

import { useTrain } from '@/provider/train-provider'

const CapturedPoses = () => {
  const { addPose } = useTrain()

  return (
    <section className='border rounded p-2'>
      <div className='flex items-center justify-between mb-2'>
        <h4 className='font-bold'>Captured Poses</h4>
        <Button onClick={addPose}>Add Pose</Button>
      </div>

      <PosesTable />
    </section>
  )
}

export default CapturedPoses
