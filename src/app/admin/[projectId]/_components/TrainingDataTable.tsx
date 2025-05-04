'use client'

import { TLabel } from '../../_types'

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
import AddRegionBtn from './btns/AddRegionBtn'
import CaptureBtn from './btns/CaptureBtn'
import EditBtn from './btns/EditBtn'
import RemoveBtn from './btns/RemoveBtn'
import PosesList from './PosesList'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React from 'react'
import { useTraining } from '../_lib/trainingContext'

const columns: ColumnDef<TLabel>[] = [
  {
    accessorKey: 'name',
    header: 'Label',
    cell: ({ row }) => {
      return (
        <Button
          variant='ghost'
          onClick={row.getToggleExpandedHandler()}
        >
          {row.original.name}
          {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
        </Button>
      )
    },
  },
  { accessorKey: 'count', header: '' },
  {
    id: 'capture',
    cell: ({ row }) => {
      return (
        <div className='flex gap-2'>
          <CaptureBtn label={row.original.name} />
          <AddRegionBtn label={row.original.name} />
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className='flex justify-end gap-2'>
          <EditBtn label={row.original.name} />
          <RemoveBtn label={row.original.name} />
        </div>
      )
    },
  },
]

export default function TrainingDataTable() {
  const { labels } = useTraining()

  const table = useReactTable<TLabel>({
    data: labels,
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
                      <PosesList label={row.original.name} />
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
