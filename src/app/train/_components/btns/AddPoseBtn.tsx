import { Button } from '@/components/ui/button'

import { addPose } from '@/lib/store/_features/poseTrainingSlice'
import { useAppDispatch } from '@/lib/store/hooks'

const AddPoseBtn = () => {
  const dispatch = useAppDispatch()

  return (
    <Button
      onClick={() => {
        dispatch(addPose())
      }}
    >
      Add Pose
    </Button>
  )
}

export default AddPoseBtn
