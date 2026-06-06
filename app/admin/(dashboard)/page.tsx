'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { StatsCard } from '@/components/admin/stats-card'
import {
  Package, FolderOpen, Layers, Star, AlertTriangle, Sparkles,
  Tag, Plus, ArrowRight, Clock, CheckCircle2,
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils/slugify'
import type { DashboardStats } from '@/lib/types/admin'

const S = {
  card: {
    background: '#18181b', border: '1px solid #27272a',
    borderRadius: '12px', overflow: 'hidden',
  } as React.CSSProperties,
  cardHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 20px', borderBottom: '1px solid #27272a',
  } as React.CSSProperties,
  cardTitle: { color: '#e4e4e7', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' } as React.CSSProperties,
  link: { color: '#7c3aed', fontSize: '12px', fontWeight: '500', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' } as React.CSSProperties,
}

function Skeleton({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'linear-gradient(90deg, #27272a 25%, #2f2f32 50%, #27272a 75%)',
      backgroundSize: '200% 100%',
      borderRadius: '8px',
      animation: 'shimmer 1.5s infinite',
      ...style,
    }} />
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const statsConfig = [
    { title: 'Total productos', key: 'total_products', icon: Package, color: '#7c3aed', bg: 'rgba(124,58,237,0.12)', desc: 'en el catálogo' },
    { title: 'Categorías', key: 'total_categories', icon: FolderOpen, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', desc: 'activas' },
    { title: 'Combos activos', key: 'total_combos', icon: Layers, color: '#10b981', bg: 'rgba(16,185,129,0.12)', desc: 'disponibles' },
    { title: 'Destacados', key: 'featured_products', icon: Star, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', desc: 'productos' },
    { title: 'Sin stock', key: 'out_of_stock', icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.12)', desc: 'requieren atención' },
    { title: 'Nuevos ingresos', key: 'new_products', icon: Sparkles, color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', desc: 'marcados como nuevo' },
    { title: 'En oferta', key: 'on_sale', icon: Tag, color: '#f97316', bg: 'rgba(249,115,22,0.12)', desc: 'con descuento activo' },
    {
      title: 'Disponibles', key: '_available', icon: CheckCircle2,
      color: '#22c55e', bg: 'rgba(34,197,94,0.12)', desc: 'en stock',
    },
  ]

  const quickActions = [
    { label: 'Nuevo producto', href: '/admin/products/new', icon: Package, color: '#7c3aed', bg: 'rgba(124,58,237,0.12)' },
    { label: 'Nueva categoría', href: '/admin/categories', icon: FolderOpen, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    { label: 'Nuevo combo', href: '/admin/combos', icon: Layers, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    { label: 'Nuevo banner', href: '/admin/banners', icon: Tag, color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  ]

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ color: '#fafafa', fontSize: '22px', fontWeight: '700', margin: 0, letterSpacing: '-0.3px' }}>Dashboard</h1>
          <p style={{ color: '#52525b', fontSize: '13px', margin: '4px 0 0' }}>Resumen de tu catálogo de productos</p>
        </div>
        <Link
          href="/admin/products/new"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            color: 'white', fontSize: '13px', fontWeight: '600',
            textDecoration: 'none', boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
          }}
        >
          <Plus size={15} />
          Nuevo producto
        </Link>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} style={{ height: '96px' }} />)
          : statsConfig.map((s) => {
              const val = s.key === '_available'
                ? (stats?.total_products ?? 0) - (stats?.out_of_stock ?? 0)
                : (stats as any)?.[s.key] ?? 0
              return (
                <StatsCard
                  key={s.title}
                  title={s.title}
                  value={val}
                  icon={s.icon}
                  iconColor={s.color}
                  iconBg={s.bg}
                  accent={s.color}
                  description={s.desc}
                />
              )
            })}
      </div>

      {/* Bottom grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px' }} className="dashboard-grid">
        <style>{`@media(max-width:900px){.dashboard-grid{grid-template-columns:1fr!important}}`}</style>

        {/* Recent products */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            <span style={S.cardTitle}>
              <Clock size={14} style={{ color: '#52525b' }} />
              Últimos productos agregados
            </span>
            <Link href="/admin/products" style={S.link}>
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
          <div>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderBottom: '1px solid #1f1f23' }}>
                  <Skeleton style={{ width: '38px', height: '38px', borderRadius: '8px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <Skeleton style={{ height: '12px', width: '60%', marginBottom: '6px' }} />
                    <Skeleton style={{ height: '10px', width: '35%' }} />
                  </div>
                  <Skeleton style={{ height: '20px', width: '72px', borderRadius: '100px' }} />
                </div>
              ))
            ) : (stats?.recent_products?.length ?? 0) === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 20px', gap: '8px' }}>
                <Package size={32} style={{ color: '#3f3f46' }} />
                <p style={{ color: '#52525b', fontSize: '13px', margin: 0 }}>No hay productos aún</p>
                <Link href="/admin/products/new" style={{ ...S.link, marginTop: '4px', fontSize: '13px' }}>
                  Crear primer producto <ArrowRight size={12} />
                </Link>
              </div>
            ) : (
              stats?.recent_products?.map((product: any, idx: number) => {
                const img = Array.isArray(product.images) ? product.images[0]?.url : null
                const isLast = idx === (stats.recent_products?.length ?? 0) - 1
                return (
                  <Link
                    key={product.id}
                    href={`/admin/products/${product.id}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '14px 20px', textDecoration: 'none',
                      borderBottom: isLast ? 'none' : '1px solid #1f1f23',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#1f1f23')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '8px',
                      background: '#27272a', overflow: 'hidden', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {img
                        ? <img src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <Package size={16} style={{ color: '#3f3f46' }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#e4e4e7', fontSize: '13px', fontWeight: '500', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.name}
                      </p>
                      <p style={{ color: '#52525b', fontSize: '11px', margin: '2px 0 0' }}>
                        {formatDateTime(product.created_at)}
                      </p>
                    </div>
                    <span style={{
                      padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '500',
                      background: product.status === 'available' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                      color: product.status === 'available' ? '#10b981' : '#f87171',
                    }}>
                      {product.status === 'available' ? 'Disponible' : 'Sin stock'}
                    </span>
                  </Link>
                )
              })
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Quick actions */}
          <div style={S.card}>
            <div style={S.cardHeader}>
              <span style={S.cardTitle}>Acciones rápidas</span>
            </div>
            <div style={{ padding: '8px' }}>
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '8px', textDecoration: 'none',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#1f1f23')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                    background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <action.icon size={15} style={{ color: action.color }} />
                  </div>
                  <span style={{ color: '#a1a1aa', fontSize: '13px', fontWeight: '500', flex: 1 }}>{action.label}</span>
                  <ArrowRight size={13} style={{ color: '#3f3f46' }} />
                </Link>
              ))}
            </div>
          </div>

          {/* Out of stock alert */}
          {!loading && (stats?.out_of_stock ?? 0) > 0 && (
            <div style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '12px', padding: '16px',
            }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <AlertTriangle size={16} style={{ color: '#f87171', flexShrink: 0, marginTop: '1px' }} />
                <div>
                  <p style={{ color: '#f87171', fontSize: '13px', fontWeight: '600', margin: 0 }}>
                    {stats?.out_of_stock} producto{(stats?.out_of_stock ?? 0) !== 1 ? 's' : ''} sin stock
                  </p>
                  <p style={{ color: '#71717a', fontSize: '11px', margin: '4px 0 8px' }}>
                    Actualizá el stock para mantener el catálogo al día
                  </p>
                  <Link href="/admin/products?status=out_of_stock" style={{ ...S.link, color: '#f87171' }}>
                    Ver productos <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Content links */}
          <div style={S.card}>
            <div style={S.cardHeader}>
              <span style={S.cardTitle}>Gestión de contenido</span>
            </div>
            <div style={{ padding: '4px 8px 8px' }}>
              {[
                { label: 'Banners del sitio', href: '/admin/banners' },
                { label: 'Secciones de inicio', href: '/admin/sections' },
                { label: 'Testimonios', href: '/admin/testimonials' },
                { label: 'Preguntas frecuentes', href: '/admin/faqs' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 10px', borderRadius: '8px', textDecoration: 'none',
                    color: '#71717a', fontSize: '13px', transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#1f1f23'; (e.currentTarget as HTMLElement).style.color = '#e4e4e7' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#71717a' }}
                >
                  <span>{item.label}</span>
                  <ArrowRight size={13} style={{ color: '#3f3f46' }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
