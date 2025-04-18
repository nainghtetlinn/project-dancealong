import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useTrain } from '@/provider/train-provider'
import { TPose } from '@/types/pose'
import { ColumnDef } from '@tanstack/react-table'
import { Video } from 'lucide-react'
import DeletePoseBtn from './DeletePoseBtn'

const columns: ColumnDef<TPose>[] = [
  { accessorKey: 'label', header: 'Label' },
  { accessorKey: 'numOfPosesCaptured', header: '' },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      // checking like this will not work as expected when we have to use pagination
      const isLast = row.index === table.getRowCount() - 1

      return (
        <div className='flex gap-2'>
          <Button
            className='bg-green-500'
            size='icon'
          >
            <Video />
          </Button>
          {isLast && <DeletePoseBtn label={row.original.label} />}
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
