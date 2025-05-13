import { Button } from '@/components/ui/button'
import { Video } from 'lucide-react'

type Props = React.ComponentProps<'button'>

export default function RecordBtn({ ...props }: Props) {
  return (
    <Button
      size='icon'
      variant='secondary'
      {...props}
    >
      <Video />
    </Button>
  )
}
