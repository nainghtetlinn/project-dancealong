import { Button } from '@/components/ui/button'
import { Upload, Loader2 } from 'lucide-react'

import { type TParsedChoreography, type TKeypoints } from '@/types'

import { useState } from 'react'
import { toast } from 'sonner'

import { useProjectDetails } from '../../../_lib/projectContext'
import { uploadChoreography } from '@/server-actions/choreography'

type Props = React.ComponentProps<'button'> & {
  choreography: { keypoints: TKeypoints; timestamp: number }[]
  onSuccess: (data: TParsedChoreography[]) => void
}

export default function UploadBtn({
  choreography,
  onSuccess,
  ...props
}: Props) {
  const { song } = useProjectDetails()

  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (choreography.length === 0)
      return toast.error('No choreography found to upload.')

    setLoading(true)
    const result = await uploadChoreography(choreography, song!.id)

    if (!result.success) toast.error(result.message)
    else {
      toast.success('Successfully uploaded.')
      const data: TParsedChoreography[] = result.data.map(c => ({
        id: c.id,
        keypoints: JSON.parse(c.keypoints_json),
        timestamp: c.timestamp,
        image_url: c.image_url,
        is_key_pose: c.is_key_pose,
        song_id: c.song_id,
      }))
      onSuccess(data)
    }

    setLoading(false)
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
