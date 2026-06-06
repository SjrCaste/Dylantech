import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/admin/theme-provider'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: { template: '%s | Admin', default: 'Panel de Administración' },
  description: 'Panel de administración del catálogo de productos',
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
      <Toaster richColors position="top-right" closeButton />
    </ThemeProvider>
  )
}
