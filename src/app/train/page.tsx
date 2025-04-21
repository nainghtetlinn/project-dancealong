'use client'

import Controls from './_components/Controls'
import Studio from './_components/Studio'

import { AudioProvider } from '@/provider/audio-provider'
import StoreProvider from '@/provider/store-provider'
import { WebcamProvider } from '@/provider/webcam-provider'

const Train = () => {
  return (
    <StoreProvider>
      <AudioProvider>
        <WebcamProvider>
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
