'use client'

import { useState } from 'react'
import { AdminSidebar } from './sidebar'
import { AdminHeader } from './admin-header'

interface AdminLayoutClientProps {
  children: React.ReactNode
  userEmail?: string | null
}

export function AdminLayoutClient({ children, userEmail }: AdminLayoutClientProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#09090b' }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 40, display: 'block',
          }}
          className="lg:hidden"
        />
      )}

      {/* Sidebar desktop */}
      <div className="hidden lg:flex" style={{ flexShrink: 0 }}>
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Sidebar mobile */}
      <div
        className="lg:hidden"
        style={{
          position: 'fixed', inset: '0 auto 0 0', zIndex: 50,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          display: 'flex',
        }}
      >
        <AdminSidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
      </div>

      {/* Main */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <AdminHeader
          onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
          userEmail={userEmail}
        />
        <main style={{ flex: 1, overflowY: 'auto', background: '#09090b' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
