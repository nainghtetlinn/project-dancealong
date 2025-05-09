'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { CircleAlert } from 'lucide-react'
import AddRegionBtn from './btns/AddRegionBtn'
import TestModelBtn from './btns/TestModelBtn'

import { ColumnDef } from '@tanstack/react-table'
import { useTraining } from '../_lib/trainingContext'

const columns: ColumnDef<string>[] = [
  {
    id: 'label',
    header: 'Label',
    cell: ({ row }) => row.original,
  },
  {
    id: 'region',
    cell: ({ row }) => <AddRegionBtn label={row.original} />,
  },
]

export default function Controls() {
  const { trainedModel, trainedModelLabels, retrain } = useTraining()

  return (
    <section className='p-2 space-y-2'>
      <div className='rounded-md border max-h-[500px] overflow-scroll'>
        <DataTable
          columns={columns}
          data={trainedModelLabels}
        />
      </div>

      <Alert>
        <CircleAlert />
        <AlertTitle>
          You've already trained a model. Would you like to re-train the model?
        </AlertTitle>
        <AlertDescription>
          Re-training the model will reset the model's training data, labels and
          song-pose events.
        </AlertDescription>
        <div className='absolute top-1/2 right-2 -translate-y-1/2 space-x-2'>
          <TestModelBtn
            model={trainedModel}
            labels={trainedModelLabels}
          />
          <Button
            size='sm'
            variant='secondary'
            onClick={retrain}
          >
            Re-train
          </Button>
        </div>
      </Alert>
    </section>
  )
}
