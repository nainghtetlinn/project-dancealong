import { AppThunk } from '../index'
import { startCounter, decrement, stopCounter } from './counterSlice'

export const startCountdown = (): AppThunk => async (dispatch, getState) => {
  dispatch(startCounter())

  for (let i = 0; i < 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    dispatch(decrement())
  }

  dispatch(stopCounter())
}
