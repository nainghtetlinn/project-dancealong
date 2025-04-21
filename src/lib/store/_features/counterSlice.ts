import { createSlice } from '@reduxjs/toolkit'

interface CounterState {
  value: number
  running: boolean
}

const initialState: CounterState = {
  value: 5,
  running: false,
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    startCounter(state) {
      state.value = 5
      state.running = true
    },
    decrement(state) {
      if (state.value > 0) {
        state.value -= 1
      }
    },
    stopCounter(state) {
      state.running = false
    },
  },
})

export const { startCounter, decrement, stopCounter } = counterSlice.actions

export default counterSlice.reducer
