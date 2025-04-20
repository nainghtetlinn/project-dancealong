import StoreProvider from '@/provider/store-provider'

const TrainLayout = ({ children }: { children: React.ReactNode }) => {
  return <StoreProvider>{children}</StoreProvider>
}

export default TrainLayout
