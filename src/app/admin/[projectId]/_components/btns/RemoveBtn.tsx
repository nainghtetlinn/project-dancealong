import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

import { useTraining } from '../../_lib/trainingContext'

export default function RemoveBtn({ label }: { label: string }) {
  const { removeLabel } = useTraining()

  const handleRemove = () => {
    removeLabel(label)
  }

  return (
    <Button
      size='icon'
      variant='destructive'
      onClick={handleRemove}
    >
      <Trash2 />
    </Button>
  )
}
