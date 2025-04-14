'use client'

import Studio from './_components/Studio'
import Controls from './_components/Controls'
import Navbar from './_components/Navbar'

import { TrainProvider } from '@/provider/train-provider'
import { AudioProvider } from '@/provider/audio-provider'

const Train = () => {
  return (
    <TrainProvider>
      <AudioProvider>
        <section className='flex flex-col h-screen'>
          <Navbar />

          <div className='flex-1 flex'>
            <div className='p-2'>
              <Studio />
            </div>

            <div className='flex-1 p-2'>
              <Controls />
            </div>
          </div>
        </section>
      </AudioProvider>
    </TrainProvider>
  )
}

export default Train
