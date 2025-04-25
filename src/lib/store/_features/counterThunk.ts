import { AppThunk } from '../index'
import {
  decrement,
  showCounter,
  hideCounter,
  startCounter,
  stopCounter,
} from './counterSlice'

export const startCountdown = (): AppThunk<Promise<void>> => async dispatch => {
  dispatch(startCounter())

  for (let i = 0; i < 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    dispatch(decrement())
  }

  dispatch(stopCounter())
}

export const startCountdownWithDisplay =
  (): AppThunk<Promise<void>> => async dispatch => {
    dispatch(showCounter())
    dispatch(startCounter())
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      dispatch(decrement())
    }
    dispatch(stopCounter())
    dispatch(hideCounter())
  }
