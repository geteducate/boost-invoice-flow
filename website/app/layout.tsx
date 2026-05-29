import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BoostProfits — Turn Attention Into Paying Customers',
  description:
    'Sharper copy. Cleaner offers. Faster buying decisions. Built for businesses tired of getting views without conversions.',
  openGraph: {
    title: 'BoostProfits — Turn Attention Into Paying Customers',
    description:
      'Sharper copy. Cleaner offers. Faster buying decisions.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
