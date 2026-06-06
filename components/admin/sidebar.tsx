'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Package, FolderOpen, Layers, Image, LayoutTemplate,
  MessageSquare, HelpCircle, Settings, ArrowUpDown, Activity,
  ChevronLeft, ChevronRight, Store, LogOut, Tag, ExternalLink,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

const navGroups = [
  {
    label: 'Principal',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Catálogo',
    items: [
      { href: '/admin/products', label: 'Productos', icon: Package },
      { href: '/admin/categories', label: 'Categorías', icon: FolderOpen },
      { href: '/admin/combos', label: 'Combos', icon: Layers },
    ],
  },
  {
    label: 'Contenido',
    items: [
      { href: '/admin/banners', label: 'Banners', icon: Image },
      { href: '/admin/sections', label: 'Secciones', icon: LayoutTemplate },
      { href: '/admin/testimonials', label: 'Testimonios', icon: MessageSquare },
      { href: '/admin/faqs', label: 'Preguntas Frecuentes', icon: HelpCircle },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { href: '/admin/import-export', label: 'Importar / Exportar', icon: ArrowUpDown },
      { href: '/admin/activity', label: 'Actividad', icon: Activity },
      { href: '/admin/settings', label: 'Configuración', icon: Settings },
    ],
  },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function AdminSidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  async function handleLogout() {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const w = collapsed ? '64px' : '240px'

  return (
    <aside style={{
      width: w, minWidth: w, maxWidth: w,
      display: 'flex', flexDirection: 'column',
      background: '#111113',
      borderRight: '1px solid #1f1f23',
      height: '100vh', position: 'sticky', top: 0,
      transition: 'width 0.25s ease, min-width 0.25s ease',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        height: '56px', display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '0' : '0 12px 0 16px',
        borderBottom: '1px solid #1f1f23', flexShrink: 0,
      }}>
        {!collapsed && (
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(124,58,237,0.35)',
            }}>
              <Store size={15} color="white" />
            </div>
            <span style={{ color: '#fafafa', fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap' }}>
              Admin Panel
            </span>
          </Link>
        )}
        {collapsed && (
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Store size={15} color="white" />
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#52525b', padding: '4px', borderRadius: '6px',
              display: 'flex', alignItems: 'center',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#a1a1aa'; (e.currentTarget as HTMLElement).style.background = '#1c1c1f' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#52525b'; (e.currentTarget as HTMLElement).style.background = 'none' }}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={onToggle}
          style={{
            margin: '8px auto 0', width: '32px', height: '32px', borderRadius: '8px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#52525b', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#1c1c1f'; (e.currentTarget as HTMLElement).style.color = '#a1a1aa' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.color = '#52525b' }}
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: '8px' }}>
            {!collapsed && (
              <p style={{
                padding: '0 8px', marginBottom: '4px',
                fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em',
                textTransform: 'uppercase', color: '#3f3f46',
              }}>
                {group.label}
              </p>
            )}
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      style={{
                        display: 'flex', alignItems: 'center',
                        gap: collapsed ? 0 : '10px',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        padding: collapsed ? '8px' : '7px 10px',
                        borderRadius: '8px', textDecoration: 'none',
                        fontSize: '13px', fontWeight: '500',
                        transition: 'background 0.12s, color 0.12s',
                        background: active ? 'rgba(124,58,237,0.15)' : 'transparent',
                        color: active ? '#a78bfa' : '#71717a',
                        position: 'relative',
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.background = '#1c1c1f'
                          ;(e.currentTarget as HTMLElement).style.color = '#e4e4e7'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.background = 'transparent'
                          ;(e.currentTarget as HTMLElement).style.color = '#71717a'
                        }
                      }}
                    >
                      {active && (
                        <div style={{
                          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                          width: '3px', height: '16px', borderRadius: '0 2px 2px 0',
                          background: '#7c3aed',
                        }} />
                      )}
                      <item.icon size={15} style={{ flexShrink: 0 }} />
                      {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #1f1f23', padding: '8px', flexShrink: 0 }}>
        <a
          href="/"
          target="_blank"
          title={collapsed ? 'Ver catálogo' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: collapsed ? 0 : '10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '8px' : '7px 10px',
            borderRadius: '8px', textDecoration: 'none',
            fontSize: '13px', color: '#52525b', marginBottom: '2px',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#1c1c1f'; (e.currentTarget as HTMLElement).style.color = '#a1a1aa' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#52525b' }}
        >
          <ExternalLink size={15} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Ver catálogo</span>}
        </a>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          title={collapsed ? 'Cerrar sesión' : undefined}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: collapsed ? 0 : '10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '8px' : '7px 10px',
            borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '13px', color: '#52525b',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; (e.currentTarget as HTMLElement).style.color = '#f87171' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#52525b' }}
        >
          <LogOut size={15} style={{ flexShrink: 0 }} />
          {!collapsed && <span>{loggingOut ? 'Saliendo...' : 'Cerrar sesión'}</span>}
        </button>
      </div>
    </aside>
  )
}
