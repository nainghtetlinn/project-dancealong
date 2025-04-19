import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'

import { useTrain } from '@/provider/train-provider'

const DeletePoseBtn = ({ label }: { label: string }) => {
  const { removePose } = useTrain()

  return (
    <Button
      variant='destructive'
      size='icon'
      onClick={() => removePose(label)}
    >
      <Trash />
    </Button>
  )
}

export default DeletePoseBtn
