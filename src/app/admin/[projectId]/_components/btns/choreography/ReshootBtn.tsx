import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'

type Props = React.ComponentProps<'button'> & {}

export default function ReshootBtn({ ...props }: Props) {
  return (
    <Button
      size='icon'
      variant='destructive'
      {...props}
    >
      <RotateCcw />
    </Button>
  )
}
