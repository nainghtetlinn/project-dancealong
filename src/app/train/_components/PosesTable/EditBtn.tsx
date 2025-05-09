import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit2 } from 'lucide-react'

import { editLabel } from '@/lib/store/_features/poseTrainingSlice'
import { useAppDispatch } from '@/lib/store/hooks'
import { useState } from 'react'
import { toast } from 'sonner'

const EditBtn = ({ label }: { label: string }) => {
  const dispatch = useAppDispatch()
  const [newLabel, setNewLabel] = useState(label)
  const [open, setOpen] = useState(false)

  const handleEdit = () => {
    if (!!newLabel && newLabel !== label) {
      dispatch(editLabel({ label, newLabel }))
      setOpen(false)
    } else if (newLabel === label) {
      toast.error('New label cannot be old label')
    } else {
      toast.error('Invalid label')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          size='icon'
          variant='secondary'
        >
          <Edit2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit pose</DialogTitle>
          <DialogDescription>Click save when you're done.</DialogDescription>
        </DialogHeader>

        <div className='space-y-2'>
          <Label htmlFor='label'>Label</Label>
          <Input
            id='label'
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleEdit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditBtn
