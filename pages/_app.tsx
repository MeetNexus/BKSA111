import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { SpeedInsights } from '@vercel/speed-insights/next'
import ErrorBoundary from '../components/ErrorBoundary'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div>
          <Navbar />
          <Component {...pageProps} />
          <Toaster position="bottom-right" />
          <SpeedInsights />
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  )
}