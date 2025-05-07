import { Button } from '@/components/ui/button'

import { useModel } from '@/provider/model-provider'

export default function SaveModelBtn() {
  const { classificationLabels } = useModel()

  const handleSave = async () => {}

  return (
    <Button
      size='sm'
      disabled={classificationLabels.length === 0}
      onClick={handleSave}
    >
      Save Model
    </Button>
  )
}
