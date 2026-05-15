import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NeuralCore AI Portal',
  description: 'Enterprise AI tool navigation and chat platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-surface text-on-surface font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}