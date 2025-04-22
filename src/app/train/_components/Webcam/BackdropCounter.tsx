import { useAppSelector } from '@/lib/store/hooks'

const BackdropCounter = () => {
  const { running, value } = useAppSelector(state => state.counter)
  const { isCapturing } = useAppSelector(state => state.training)

  if (!isCapturing && running)
    return (
      <div className='absolute inset-0 z-20 bg-black/40 flex items-center justify-center text-5xl'>
        {value}
      </div>
    )

  return null
}

export default BackdropCounter
