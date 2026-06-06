'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, Search, User, LogOut, Settings, Activity, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AdminHeaderProps {
  onMobileMenuToggle: () => void
  userEmail?: string | null
}

export function AdminHeader({ onMobileMenuToggle, userEmail }: AdminHeaderProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/admin/products?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const initial = userEmail ? userEmail[0].toUpperCase() : 'A'

  return (
    <header style={{
      height: '56px', display: 'flex', alignItems: 'center',
      padding: '0 16px', gap: '12px',
      background: '#111113',
      borderBottom: '1px solid #27272a',
      position: 'sticky', top: 0, zIndex: 30, flexShrink: 0,
    }}>
      {/* Mobile menu */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '6px', borderRadius: '8px', color: '#a1a1aa',
          display: 'flex', alignItems: 'center',
        }}
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '360px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} color="#52525b" style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none',
          }} />
          <input
            type="text"
            placeholder="Buscar productos, categorías..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#1c1c1f', border: '1px solid #27272a',
              borderRadius: '8px', padding: '7px 12px 7px 34px',
              color: '#e4e4e7', fontSize: '13px', outline: 'none',
            }}
            onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
            onBlur={(e) => e.target.style.borderColor = '#27272a'}
          />
        </div>
      </form>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* View catalog */}
        <a
          href="/"
          target="_blank"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '8px',
            background: '#1c1c1f', border: '1px solid #27272a',
            color: '#a1a1aa', fontSize: '12px', fontWeight: '500',
            textDecoration: 'none', cursor: 'pointer',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#3f3f46'; (e.currentTarget as HTMLElement).style.color = '#e4e4e7' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#27272a'; (e.currentTarget as HTMLElement).style.color = '#a1a1aa' }}
        >
          <ExternalLink size={12} />
          <span className="hidden sm:inline">Ver catálogo</span>
        </a>

        {/* User menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '5px 10px 5px 5px',
              background: userMenuOpen ? '#1c1c1f' : 'transparent',
              border: '1px solid', borderColor: userMenuOpen ? '#3f3f46' : 'transparent',
              borderRadius: '8px', cursor: 'pointer',
            }}
          >
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: '700', color: 'white',
            }}>
              {initial}
            </div>
            <span className="hidden sm:inline" style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: '500', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userEmail ?? 'Admin'}
            </span>
          </button>

          {userMenuOpen && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                onClick={() => setUserMenuOpen(false)}
              />
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                background: '#18181b', border: '1px solid #27272a',
                borderRadius: '12px', padding: '6px',
                minWidth: '200px', zIndex: 50,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}>
                <div style={{ padding: '8px 10px 10px', borderBottom: '1px solid #27272a', marginBottom: '6px' }}>
                  <p style={{ color: '#fafafa', fontSize: '13px', fontWeight: '600', margin: 0 }}>Administrador</p>
                  <p style={{ color: '#71717a', fontSize: '11px', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {userEmail ?? 'admin@tienda.com'}
                  </p>
                </div>
                {[
                  { icon: Settings, label: 'Configuración', href: '/admin/settings' },
                  { icon: Activity, label: 'Actividad reciente', href: '/admin/activity' },
                ].map((item) => (
                  <button
                    key={item.href}
                    onClick={() => { router.push(item.href); setUserMenuOpen(false) }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 10px', borderRadius: '8px', background: 'none',
                      border: 'none', cursor: 'pointer', color: '#a1a1aa', fontSize: '13px',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#27272a'; (e.currentTarget as HTMLElement).style.color = '#fafafa' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.color = '#a1a1aa' }}
                  >
                    <item.icon size={14} />
                    {item.label}
                  </button>
                ))}
                <div style={{ borderTop: '1px solid #27272a', marginTop: '6px', paddingTop: '6px' }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 10px', borderRadius: '8px', background: 'none',
                      border: 'none', cursor: 'pointer', color: '#f87171', fontSize: '13px',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'none' }}
                  >
                    <LogOut size={14} />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
