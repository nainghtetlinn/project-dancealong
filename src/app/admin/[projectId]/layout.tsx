import { ModelProvider } from '@/provider/model-provider'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ModelProvider type='thunder'>{children}</ModelProvider>
}
