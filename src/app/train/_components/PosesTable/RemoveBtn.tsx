import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'

import { useAppDispatch } from '@/lib/store/hooks'
import { removePose } from '@/lib/store/_features/poseTrainingSlice'

const RemoveBtn = ({ label }: { label: string }) => {
  const dispatch = useAppDispatch()

  return (
    <Button
      variant='destructive'
      size='icon'
      onClick={() => dispatch(removePose(label))}
    >
      <Trash />
    </Button>
  )
}

export default RemoveBtn
