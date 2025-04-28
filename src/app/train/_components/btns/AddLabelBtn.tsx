import { Button } from '@/components/ui/button'

import { addLabel } from '@/lib/store/_features/poseTrainingSlice'
import { useAppDispatch } from '@/lib/store/hooks'

const AddLabelBtn = () => {
  const dispatch = useAppDispatch()

  return (
    <Button
      onClick={() => {
        dispatch(addLabel())
      }}
    >
      Add Label
    </Button>
  )
}

export default AddLabelBtn
