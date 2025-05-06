import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

import { useTraining } from '../../_lib/trainingContext'
import { useAudio } from '../../_lib/audioContext'

export default function RemoveBtn({ label }: { label: string }) {
  const { removeLabel } = useTraining()
  const { removeRegionsByLabel } = useAudio()

  const handleRemove = () => {
    removeLabel(label)
    removeRegionsByLabel(label)
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
