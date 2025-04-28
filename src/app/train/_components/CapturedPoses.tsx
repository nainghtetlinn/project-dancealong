import PosesTable from './PosesTable'
import AddLabelBtn from './btns/AddLabelBtn'
import ExportBtn from './btns/ExportBtn'
import ImportBtn from './btns/ImportBtn'
import TrainBtn from './btns/TrainBtn'

const CapturedPoses = () => {
  return (
    <section className='border rounded p-2 space-y-2'>
      <div className='flex items-center justify-between'>
        <h4 className='font-bold'>Captured Poses</h4>
        <div className='space-x-2'>
          <ImportBtn />
          <AddLabelBtn />
        </div>
      </div>

      <PosesTable />

      <div className='flex items-center justify-end gap-2'>
        <ExportBtn />
        <TrainBtn />
      </div>
    </section>
  )
}

export default CapturedPoses
