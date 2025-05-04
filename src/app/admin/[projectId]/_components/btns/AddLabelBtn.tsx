import { Button } from '@/components/ui/button'

import { useTraining } from '../../_lib/trainingContext'

export default function AddLabelBtn() {
  const { addLabel } = useTraining()

  return (
    <Button
      size='sm'
      onClick={addLabel}
    >
      Add Label
    </Button>
  )
}
