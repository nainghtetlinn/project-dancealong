import { createSlice } from '@reduxjs/toolkit'

interface CounterState {
  value: number
  running: boolean
  show: boolean
}

const initialState: CounterState = {
  value: 5,
  running: false,
  show: false,
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
    showCounter(state) {
      state.show = true
    },
    hideCounter(state) {
      state.show = false
    },
  },
})

export const {
  startCounter,
  decrement,
  stopCounter,
  showCounter,
  hideCounter,
} = counterSlice.actions

export default counterSlice.reducer
