import type { Metadata } from 'next'
import { Anton, Archivo, Spline_Sans_Mono } from 'next/font/google'
import ClientWrapper from './ClientWrapper'
import './globals.css'

const anton = Anton({ subsets: ['latin'], weight: '400', variable: '--font-anton' })
const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo' })
const spline = Spline_Sans_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'SVINCOLATI — Il mercato del calcio dilettantistico',
  description: 'La piattaforma che mette in contatto giocatori svincolati e società sportive.',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`${anton.variable} ${archivo.variable} ${spline.variable}`}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  )
}
