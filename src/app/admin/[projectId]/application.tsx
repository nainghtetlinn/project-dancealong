import { TProject } from '../_types'
import Studio from './_components/Studio'
import { AudioProvider } from './_lib/audioContext'

export default function Application({ project }: { project: TProject }) {
  return (
    <AudioProvider song={project.songs}>
      <Studio project={project} />
    </AudioProvider>
  )
}
