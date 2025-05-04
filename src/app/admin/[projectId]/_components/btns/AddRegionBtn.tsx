import { Button } from '@/components/ui/button'
import { PlusSquare } from 'lucide-react'

import { useAudio } from '../../_lib/audioContext'

export default function AddRegionBtn({ label }: { label: string }) {
  const { addRegion } = useAudio()

  const handleClick = () => {
    addRegion(label)
  }

  return (
    <Button
      size='icon'
      variant='secondary'
      onClick={handleClick}
    >
      <PlusSquare />
    </Button>
  )
}
