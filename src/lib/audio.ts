import WaveSurfer from 'wavesurfer.js'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.esm.js'

export const initWaveSurfer = (container: HTMLDivElement) => {
  return WaveSurfer.create({
    container,
    height: 80,
    barWidth: 2,
    waveColor: 'oklch(.552 .016 285.938)',
    progressColor: 'oklch(.646 .222 41.116)',
    dragToSeek: true,
    hideScrollbar: true,
    plugins: [
      TimelinePlugin.create(),
      Hover.create({
        lineColor: 'oklch(0.623 0.214 259.815)',
        lineWidth: 2,
        labelBackground: '#555',
        labelColor: '#fff',
        labelSize: '11px',
      }),
      ZoomPlugin.create({
        scale: 0.1,
        maxZoom: 100,
      }),
    ],
  })
}

export const readAudio = (audio: File, callback: (audio: Blob) => void) => {
  const fileReader = new FileReader()
  fileReader.onload = function (e) {
    if (e.target && e.target.result) {
      const blob = new Blob([e.target.result])
      callback(blob)
    }
  }
  fileReader.readAsArrayBuffer(audio)
}
