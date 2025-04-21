'use client'

import Controls from './_components/Controls'
import Navbar from './_components/Navbar'
import Studio from './_components/Studio'

import { AudioProvider } from '@/provider/audio-provider'
import { TrainProvider } from '@/provider/train-provider'
import { WebcamProvider } from '@/provider/webcam-provider'

const Train = () => {
  return (
    <TrainProvider>
      <AudioProvider>
        <WebcamProvider>
          <section className='flex flex-col h-screen'>
            <Navbar />

            <div className='flex-1 flex'>
              <div className='p-2'>
                <Studio />
              </div>

              <div className='flex-1 p-2 overflow-hidden'>
                <Controls />
              </div>
            </div>
          </section>
        </WebcamProvider>
      </AudioProvider>
    </TrainProvider>
  )
}

export default Train
