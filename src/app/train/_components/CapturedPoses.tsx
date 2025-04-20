import { Button } from '@/components/ui/button'
import PosesTable from './PosesTable'

import { useTrain } from '@/provider/train-provider'

const CapturedPoses = () => {
  const { addPose, exportTrainingData } = useTrain()

  return (
    <section className='border rounded p-2 space-y-2'>
      <div className='flex items-center justify-between'>
        <h4 className='font-bold'>Captured Poses</h4>
        <Button onClick={addPose}>Add Pose</Button>
      </div>

      <PosesTable />

      <div className='flex items-center justify-end'>
        <Button
          variant='secondary'
          onClick={exportTrainingData}
        >
          Export data
        </Button>
      </div>
    </section>
  )
}

export default CapturedPoses
