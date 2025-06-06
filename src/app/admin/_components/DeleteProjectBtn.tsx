'use client'

import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-react'

import { deleteProject } from '@/server-actions/project'
import { useState } from 'react'
import { toast } from 'sonner'

export default function DeleteProjectBtn({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    const result = await deleteProject(id)
    if (!result.success) {
      toast.error('Delete failed.')
    }
    setLoading(false)
  }

  return (
    <Button
      size='icon'
      variant='destructive'
      disabled={loading}
      onClick={handleDelete}
    >
      {loading ? <Loader2 className='animate-spin' /> : <Trash2 />}
    </Button>
  )
}
