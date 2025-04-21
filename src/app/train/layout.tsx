import Navbar from './_components/Navbar'

const TrainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar />
      <main className='flex-1'>{children}</main>
    </div>
  )
}

export default TrainLayout
