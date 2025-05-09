'use client'

import { TProject } from '../../_types'

import { Button } from '@/components/ui/button'
import ImportBtn from './btns/ImportBtn'
import ExportBtn from './btns/ExportBtn'
import AddLabelBtn from './btns/AddLabelBtn'
import TrainBtn from './btns/TrainBtn'
import SaveModelBtn from './btns/SaveModelBtn'
import TestModelBtn from './btns/TestModelBtn'
import TrainingDataTable from './TrainingDataTable'

import { useTraining } from '../_lib/trainingContext'

export default function TrainingData({ project }: { project: TProject }) {
  const { localTrainedModel, localTrainedModelLabels, calcelRetrain } =
    useTraining()

  return (
    <section className='p-2 mt-2 border-t'>
      <div className='mb-2 flex items-center justify-between'>
        <h4 className='font-bold text-lg'>Training Data</h4>
        <div className='space-x-2'>
          <ImportBtn />
          <ExportBtn />
          <AddLabelBtn />
        </div>
      </div>

      <TrainingDataTable />

      <div className='mt-2 flex items-center justify-end gap-2'>
        <Button
          size='sm'
          variant='secondary'
          onClick={calcelRetrain}
        >
          Cancel
        </Button>
        <TrainBtn />
        <TestModelBtn
          model={localTrainedModel}
          labels={localTrainedModelLabels}
        />
        <SaveModelBtn projectId={project.id} />
      </div>
    </section>
  )
}
