import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import { ChangeEvent } from 'react'
import { toast } from 'sonner'
import { useAppDispatch } from '@/lib/store/hooks'
import { importPoses } from '@/lib/store/_features/poseTrainingSlice'

const ImportBtn = () => {
  const dispatch = useAppDispatch()

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
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
          dispatch(importPoses(json))
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
        variant='secondary'
        asChild
      >
        <Label htmlFor='data-import'>Import Data</Label>
      </Button>
    </>
  )
}

export default ImportBtn
