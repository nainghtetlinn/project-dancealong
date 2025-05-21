import { TChoreography, TProject, TSong } from '@/types'

import Studio from './_components/Studio'
import { AudioProvider } from './_lib/audioContext'
import { ProjectDetailsProvider } from './_lib/projectContext'

export default function Application(props: {
  project: TProject
  song: TSong | null
  choreography: TChoreography[] | null
}) {
  return (
    <ProjectDetailsProvider {...props}>
      <AudioProvider song={props.song}>
        <Studio />
      </AudioProvider>
    </ProjectDetailsProvider>
  )
}
