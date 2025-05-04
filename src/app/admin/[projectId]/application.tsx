import { TProject } from '../_types'
import Studio from './_components/Studio'
import { AudioProvider } from './_lib/audioContext'
import { TrainingProvider } from './_lib/trainingContext'

export default function Application({ project }: { project: TProject }) {
  return (
    <AudioProvider song={project.songs}>
      <TrainingProvider>
        <Studio project={project} />
      </TrainingProvider>
    </AudioProvider>
  )
}
