import ImportBtn from './btns/ImportBtn'
import ExportBtn from './btns/ExportBtn'
import AddLabelBtn from './btns/AddLabelBtn'
import TrainBtn from './btns/TrainBtn'
import TestModelBtn from './btns/TestModelBtn'
import TrainingDataTable from './TrainingDataTable'

export default function TrainingData() {
  return (
    <section className='p-2 mt-2 border-t'>
      <div className='mb-2 flex items-center justify-between'>
        <h4 className='font-bold text-lg'>Training Data</h4>
        <div className='space-x-2'>
          <ImportBtn />
          <ExportBtn />
          <AddLabelBtn />
          <TrainBtn />
          <TestModelBtn />
        </div>
      </div>

      <TrainingDataTable />
    </section>
  )
}
