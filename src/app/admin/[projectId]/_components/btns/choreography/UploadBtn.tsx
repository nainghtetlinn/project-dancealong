import { Button } from '@/components/ui/button'
import { Upload, Loader2 } from 'lucide-react'

import { type TKeypoints } from '@/types'

import { useState } from 'react'
import { toast } from 'sonner'

import { useProjectDetails } from '../../../_lib/projectContext'
import { uploadChoreography } from '@/server-actions/choreography'

type Props = React.ComponentProps<'button'> & {
  choreography: { keypoints: TKeypoints; timestamp: number }[]
  onSuccess: () => void
}

export default function UploadBtn({
  choreography,
  onSuccess,
  ...props
}: Props) {
  const { song } = useProjectDetails()

  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (choreography.length > 0 && !!song) {
      setLoading(true)
      const result = await uploadChoreography(choreography, song.id)

      if (!result.success) toast.error(result.message)
      else {
        toast.success('Successfully uploaded.')
        onSuccess()
      }

      setLoading(false)
    }
  }

  return (
    <Button
      size='icon'
      variant='secondary'
      disabled={loading}
      onClick={handleUpload}
      {...props}
    >
      {loading ? <Loader2 className='animate-spin' /> : <Upload />}
    </Button>
  )
}
