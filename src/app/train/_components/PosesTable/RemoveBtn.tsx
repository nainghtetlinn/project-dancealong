import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

import { useAppDispatch } from '@/lib/store/hooks'
import { removeLabel } from '@/lib/store/_features/poseTrainingSlice'

const RemoveBtn = ({ label }: { label: string }) => {
  const dispatch = useAppDispatch()

  return (
    <Button
      variant='destructive'
      size='icon'
      onClick={() => dispatch(removeLabel(label))}
    >
      <Trash2 />
    </Button>
  )
}

export default RemoveBtn
