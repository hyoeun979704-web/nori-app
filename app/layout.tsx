import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '노리 — 우리 아이 맞춤 놀이 AI',
  description:
    '0~7세 영유아 부모를 위한 AI 놀이 가이드. 지금 당장 할 수 있는 놀이를 음성으로 추천해 드려요.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
