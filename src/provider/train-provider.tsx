import React, { createContext, useContext, useRef, useState } from 'react'

const constants = {
  canvas: {
    width: 640,
    height: 480,
  },
} as const

interface TrainContext {
  constants: typeof constants
}

const trainContext = createContext<TrainContext>({
  constants,
})

export const TrainProvider = ({ children }: { children: React.ReactNode }) => {
  const poses = useRef([])
  const posesName = useRef([])

  return (
    <trainContext.Provider value={{ constants }}>
      {children}
    </trainContext.Provider>
  )
}

export const useTrain = () => useContext(trainContext)
