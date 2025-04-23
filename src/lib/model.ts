import * as tf from '@tensorflow/tfjs'

export const createModel = async (
  data: { label: string; keypoints: number[][] }[]
) => {
  const labels = Array.from(new Set(data.map(d => d.label)))
  const inputs: number[][] = []
  const outputs: number[][] = []

  data.forEach(d => {
    inputs.push(
      d.keypoints
        .map(kp => {
          if (kp[2] < 0.3) {
            return [0, 0]
          }
          return [kp[0], kp[1]]
        })
        .flat()
    )

    const oneHot = new Array(labels.length).fill(0) as number[]
    oneHot[labels.indexOf(d.label)] = 1

    outputs.push(oneHot)
  })

  tf.util.shuffleCombo(inputs, outputs)

  const xs = tf.tensor(inputs)
  const ys = tf.tensor(outputs)

  const model = tf.sequential()

  model.add(
    tf.layers.dense({ inputShape: [34], units: 128, activation: 'relu' })
  )
  model.add(tf.layers.dropout({ rate: 0.3 }))
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }))
  model.add(tf.layers.dense({ units: labels.length, activation: 'softmax' }))

  model.compile({
    optimizer: 'adam',
    loss:
      labels.length === 2 ? 'binaryCrossentropy' : 'categoricalCrossentropy',
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

  return { labels, model }
}
