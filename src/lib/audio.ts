import WaveSurfer from 'wavesurfer.js'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.esm.js'

export const initWaveSurfer = (container: HTMLDivElement) => {
  const regions = RegionsPlugin.create()

  const ws = WaveSurfer.create({
    container,
    height: 100,
    barWidth: 2.5,
    barRadius: 12,
    barHeight: 0.8,
    cursorWidth: 0,
    waveColor: 'oklch(.552 .016 285.938)',
    progressColor: 'oklch(.646 .222 41.116)',
    dragToSeek: true,
    hideScrollbar: true,
    plugins: [
      TimelinePlugin.create(),
      Hover.create({
        lineColor: 'oklch(0.723 0.219 149.579)',
        lineWidth: 2,
        labelBackground: '#555',
        labelColor: '#fff',
        labelSize: '11px',
      }),
      ZoomPlugin.create({
        scale: 0.1,
        maxZoom: 100,
      }),
      regions,
    ],
  })

  return { regions, ws }
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
