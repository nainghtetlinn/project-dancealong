import * as tf from '@tensorflow/tfjs'

export const createModel = async (
  data: { label: string; keypoints: number[][] }[]
) => {
  const LABELS = Array.from(new Set(data.map(d => d.label)))
  const inputs = data.map(d => d.keypoints.flat())
  const outputs = data.map(d => {
    const oneHot = new Array(LABELS.length).fill(0) as number[]
    oneHot[LABELS.indexOf(d.label)] = 1
    return oneHot
  })

  tf.util.shuffleCombo(inputs, outputs)

  const xs = tf.tensor(inputs)
  const ys = tf.tensor(outputs)

  const model = tf.sequential()

  model.add(
    tf.layers.dense({ inputShape: [51], units: 128, activation: 'relu' })
  )
  model.add(tf.layers.dropout({ rate: 0.3 }))
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }))
  model.add(tf.layers.dense({ units: LABELS.length, activation: 'softmax' }))

  model.compile({
    optimizer: 'adam',
    loss:
      LABELS.length === 2 ? 'binaryCrossentropy' : 'categoricalCrossentropy',
    metrics: ['accuracy'],
  })

  await model.fit(xs, ys, {
    epochs: 20,
    shuffle: true,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1}: accuracy = ${logs?.acc}`)
      },
    },
  })

  xs.dispose()
  ys.dispose()

  return { labels: LABELS, model }
}
