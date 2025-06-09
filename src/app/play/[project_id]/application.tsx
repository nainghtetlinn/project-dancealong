import { TParsedChoreography, TProject, TSong } from '@/types'

import Game from './_components/Game'
import { AudioProvider } from './_lib/audioContext'

export default function Application(props: {
  project: TProject
  song: TSong
  choreography: TParsedChoreography[]
}) {
  return (
    <AudioProvider song={props.song}>
      <Game {...props} />
    </AudioProvider>
  )
}
