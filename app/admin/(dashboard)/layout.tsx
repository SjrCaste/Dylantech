import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AdminLayoutClient } from '@/components/admin/admin-layout-client'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <AdminLayoutClient userEmail={user.email}>
      {children}
    </AdminLayoutClient>
  )
}
