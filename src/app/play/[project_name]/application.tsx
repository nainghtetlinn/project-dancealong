import { type TProject, type TSong } from '@/types'

import Game from './_components/Game'
import { AudioProvider } from './_lib/audioContext'

export default function Application({
  project,
  song,
}: {
  project: TProject
  song: TSong
}) {
  return (
    <AudioProvider song={song}>
      <div className='h-screen overflow-hidden relative'>
        <Game
          project={project}
          song={song}
        />
      </div>
    </AudioProvider>
  )
}
