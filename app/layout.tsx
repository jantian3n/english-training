import type { Metadata } from 'next'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { SessionProvider } from 'next-auth/react'
import ThemeRegistry from '@/components/ThemeRegistry'
import NavBar from '@/components/NavBar'

export const metadata: Metadata = {
  title: '英语单词训练 - 间隔重复学习',
  description: '使用AI驱动的间隔重复技术掌握英语词汇',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <AppRouterCacheProvider>
          <SessionProvider>
            <ThemeRegistry>
              <NavBar />
              {children}
            </ThemeRegistry>
          </SessionProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
