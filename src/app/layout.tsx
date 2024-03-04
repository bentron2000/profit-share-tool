import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { ColorSchemeScript, createTheme, MantineProvider } from '@mantine/core'
import { Comfortaa } from 'next/font/google'

import './globals.css'
import '@mantine/charts/styles.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { Notifications } from '@mantine/notifications'

const comfortaa = Comfortaa({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-comfortaa',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Profit Share Tool',
  description:
    'A little tool to help you understand different profit share scenarios.'
}

const theme = createTheme({})

export default function RootLayout({
  chart,
  controls
}: Readonly<{
  children: ReactNode
  chart: ReactNode
  controls: ReactNode
}>) {
  return (
    <html lang='en' className={comfortaa.className}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications />
          <div className='flex h-screen'>
            <div className='w-96'>{controls}</div>
            <div className='grow'>{chart}</div>
          </div>
        </MantineProvider>
      </body>
    </html>
  )
}
