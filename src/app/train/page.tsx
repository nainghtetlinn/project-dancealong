'use client'

import Countdown from './_components/Countdown'
import Webcam from './_components/Webcam'
import Studio from './_components/Studio'

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

          <Studio />
        </WebcamProvider>
      </AudioProvider>
    </StoreProvider>
  )
}

export default Train
