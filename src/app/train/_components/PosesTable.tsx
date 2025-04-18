import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useTrain } from '@/provider/train-provider'
import { TPose } from '@/types/pose'
import { ColumnDef } from '@tanstack/react-table'
import { Trash, Edit, Video } from 'lucide-react'
import DeletePoseBtn from './DeletePoseBtn'

const columns: ColumnDef<TPose>[] = [
  { accessorKey: 'label', header: 'Label' },
  { accessorKey: 'numOfPosesCaptured', header: '' },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className='flex justify-end gap-2'>
          <Button
            className='bg-green-500'
            size='icon'
          >
            <Video />
          </Button>
          <Button
            variant='secondary'
            size='icon'
          >
            <Edit />
          </Button>
          <DeletePoseBtn label={row.original.label} />
        </div>
      )
    },
  },
]

const PosesTable = () => {
  const { poses } = useTrain()

  return (
    <DataTable
      columns={columns}
      data={poses}
    />
  )
}

export default PosesTable
