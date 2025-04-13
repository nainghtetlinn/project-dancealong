'use client'

import Studio from './_components/Studio'
import LeftSidebar from './_components/LeftSidebar'
import Navbar from './_components/Navbar'
import RightSidebar from './_components/RightSidebar'

import { TrainProvider } from '@/provider/train-provider'
import { AudioProvider } from '@/provider/audio-provider'

const Train = () => {
  return (
    <TrainProvider>
      <AudioProvider>
        <section className='flex flex-col h-screen'>
          <Navbar />

          <div className='flex-1 grid grid-cols-10'>
            <div className='col-span-2'>
              <LeftSidebar />
            </div>
            <div className='col-span-6'>
              <Studio />
            </div>
            <div className='col-span-2'>
              <RightSidebar />
            </div>
          </div>
        </section>
      </AudioProvider>
    </TrainProvider>
  )
}

export default Train
