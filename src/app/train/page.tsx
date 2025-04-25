'use client'

import Controls from './_components/Controls'
import Countdown from './_components/Countdown'
import Studio from './_components/Studio'
import Webcam from './_components/Webcam'

import { AudioProvider } from '@/provider/audio-provider'
import StoreProvider from '@/provider/store-provider'
import { WebcamProvider } from '@/provider/webcam-provider'

const Train = () => {
  return (
    <StoreProvider>
      <AudioProvider>
        <WebcamProvider>
          <Countdown />
          <Webcam />

          <div className='flex'>
            <div className='p-2'>
              <Studio />
            </div>

            <div className='flex-1 p-2 overflow-hidden'>
              <Controls />
            </div>
          </div>
        </WebcamProvider>
      </AudioProvider>
    </StoreProvider>
  )
}

export default Train
