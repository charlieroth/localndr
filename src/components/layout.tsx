import type React from 'react'
import { ThemeProvider } from '@/components/theme-provider'

type LayoutProps = {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
}
