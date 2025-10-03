import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GIWA Dodge - A Web3 Arcade Game',
  description: 'Dodge falling Korean roof tiles and earn points!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  )
}
