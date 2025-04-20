import { DataTable } from '@/components/ui/data-table'
import { useTrain } from '@/provider/train-provider'
import { TPose } from '@/types/pose'
import { ColumnDef } from '@tanstack/react-table'
import CaptureBtn from './CaptureBtn'
import EditBtn from './EditBtn'
import RemoveBtn from './RemoveBtn'

const columns: ColumnDef<TPose>[] = [
  { accessorKey: 'label', header: 'Label' },
  { accessorKey: 'numOfPosesCaptured', header: '' },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className='flex gap-2'>
          <CaptureBtn label={row.original.label} />
          <EditBtn label={row.original.label} />
          <RemoveBtn label={row.original.label} />
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
