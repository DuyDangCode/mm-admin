import '@/styles/global.css'
import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css'
import '@mantine/dates/styles.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MantineProvider } from '@mantine/core'
import TanStackProvider from '@/services/TanStackProvider'
import { theme } from '@/theme'
import Header from '@/components/Header/header'
import Footer from '@/components/Footer/footer'
import BottomNavBar from '@/components/Mobile/BottomNavBar/bottomNavBar'
import { Suspense } from 'react'
import Loading from './loading'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Material Mastery Admin',
  description: 'Admin page for material Mastery'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='vi'>
      <head>
        <link rel='shortcut icon' href='/display-icon.svg' />
      </head>

      <body
        className={`${inter.className} h-full`}
        style={{ backgroundColor: '#f1f2f5' }}
      >
        <Providers>
          <MantineProvider theme={theme} defaultColorScheme='light'>
            <TanStackProvider>
              <Header />
              <Suspense fallback={<Loading />}>{children}</Suspense>
              <Footer />
            </TanStackProvider>
          </MantineProvider>
        </Providers>
      </body>
    </html>
  )
}
