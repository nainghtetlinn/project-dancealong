import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import poseTrainingReducer from './_features/poseTrainingSlice'
import counterReducer from './_features/counterSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      training: poseTrainingReducer,
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
