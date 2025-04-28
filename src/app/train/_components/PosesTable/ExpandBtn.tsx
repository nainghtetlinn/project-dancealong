import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

const ExpandBtn = ({
  isExpanded,
  handleClick,
}: {
  isExpanded: boolean
  handleClick: () => void
}) => {
  return (
    <Button
      variant='secondary'
      size='icon'
      onClick={handleClick}
    >
      {isExpanded ? <ChevronUp /> : <ChevronDown />}
    </Button>
  )
}

export default ExpandBtn
