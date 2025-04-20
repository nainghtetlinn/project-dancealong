import { DataTable } from '@/components/ui/data-table'
import { useTrain } from '@/provider/train-provider'
import { TPose } from '@/types/pose'
import { ColumnDef } from '@tanstack/react-table'
import CaptureBtn from './CaptureBtn'
import DeletePoseBtn from './DeletePoseBtn'
import EditBtn from './EditBtn'

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
          <CaptureBtn label={row.original.label} />
          <EditBtn label={row.original.label} />
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
