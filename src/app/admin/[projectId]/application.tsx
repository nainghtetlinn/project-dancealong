import { TProject } from '../_types'
import Studio from './_components/Studio'
import Webcam from './_components/Webcam'
import { AudioProvider } from './_lib/audioContext'
import { TrainingProvider } from './_lib/trainingContext'
import { WebcamProvider } from './_lib/webcamContext'

export default function Application({ project }: { project: TProject }) {
  return (
    <AudioProvider song={project.songs}>
      <TrainingProvider model={project.models}>
        <WebcamProvider>
          <Webcam />
          <Studio project={project} />
        </WebcamProvider>
      </TrainingProvider>
    </AudioProvider>
  )
}
