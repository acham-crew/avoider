import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GIWA Dodge - Avoid the Falling Tiles',
  description: 'A retro-style arcade game where you dodge falling Korean roof tiles',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
