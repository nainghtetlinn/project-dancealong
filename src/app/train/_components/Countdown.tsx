import { useAppSelector } from '@/lib/store/hooks'

const Countdown = () => {
  const { show, running, value } = useAppSelector(state => state.counter)

  if (show && running)
    return (
      <div className='fixed z-50 inset-0 flex items-center justify-center bg-black/80'>
        <h2 className='text-9xl'>{value}</h2>
      </div>
    )

  return null
}

export default Countdown
