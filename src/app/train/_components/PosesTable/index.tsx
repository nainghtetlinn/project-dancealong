import type { Pose } from '@/types'
import type { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChevronDown, ChevronUp } from 'lucide-react'
import CaptureBtn from './CaptureBtn'
import EditBtn from './EditBtn'
import RemoveBtn from './RemoveBtn'
import PosesList from './PosesList'

import { useAppSelector } from '@/lib/store/hooks'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React from 'react'

const columns: ColumnDef<Pose>[] = [
  {
    accessorKey: 'label',
    header: 'Label',
    cell: ({ row }) => {
      return (
        <Button
          variant='ghost'
          onClick={row.getToggleExpandedHandler()}
        >
          {row.original.label}
          {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
        </Button>
      )
    },
  },
  { accessorKey: 'numOfPosesCaptured', header: '' },
  {
    id: 'capture',
    cell: ({ row }) => {
      return (
        <div className='flex gap-2'>
          <CaptureBtn label={row.original.label} />
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className='flex justify-end gap-2'>
          <EditBtn label={row.original.label} />
          <RemoveBtn label={row.original.label} />
        </div>
      )
    },
  },
]

const PosesTable = () => {
  const { poses } = useAppSelector(state => state.training)

  const table = useReactTable<Pose>({
    data: poses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  })

  return (
    <div className='rounded-md border overflow-hidden'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <React.Fragment key={row.id}>
                <TableRow data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow>
                    <TableCell
                      className='p-0'
                      colSpan={row.getAllCells().length}
                    >
                      <PosesList label={row.original.label} />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className='h-24 text-center'
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default PosesTable
