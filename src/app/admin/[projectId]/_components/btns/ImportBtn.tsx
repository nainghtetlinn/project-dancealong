import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import { useTraining } from '../../_lib/trainingContext'
import { toast } from 'sonner'

export default function ImportBtn() {
  const { importData } = useTraining()

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = event => {
      if (
        event.target &&
        event.target.result &&
        typeof event.target.result === 'string'
      ) {
        try {
          const json = JSON.parse(event.target.result)
          importData(json)
        } catch (error) {
          toast.error('Invalid JSON file')
        }
      }
    }
    reader.readAsText(file)
  }

  return (
    <>
      <input
        id='data-import'
        type='file'
        accept='.json'
        className='hidden'
        onChange={handleUpload}
      />

      <Button
        size='sm'
        variant='secondary'
        asChild
      >
        <Label htmlFor='data-import'>Import Data</Label>
      </Button>
    </>
  )
}
