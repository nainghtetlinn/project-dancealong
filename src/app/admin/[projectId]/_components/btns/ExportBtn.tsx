import { Button } from '@/components/ui/button'

import { toast } from 'sonner'
import { useTraining } from '../../_lib/trainingContext'

export default function ExportBtn() {
  const { labels, exportData } = useTraining()

  const handleExport = () => {
    /**
     * Check if all labels have at least some poses captured
     */
    let trainable = true
    labels.forEach(label => {
      if (label.count === 0) trainable = false
    })

    if (trainable) exportData()
    else toast.error('Not all poses have been captured')
  }

  return (
    <Button
      size='sm'
      variant='secondary'
      disabled={labels.length < 2}
      onClick={handleExport}
    >
      Export Data
    </Button>
  )
}
