import SongUpload from './SongUpload'
import Player from './Player'
import SongDetails from './SongDetails'
import AudioTimeline from './AudioTimeline'

import { useAudio } from '@/provider/audio-provider'

const Controls = () => {
  const { audio } = useAudio()

  return (
    <main className='h-full space-y-2'>
      <SongDetails />
      {audio !== null ? (
        <>
          <AudioTimeline />
          <Player />
        </>
      ) : (
        <SongUpload />
      )}
    </main>
  )
}

export default Controls
