import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  trend?: { value: number; label: string }
  accent?: string
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = '#7c3aed',
  iconBg = 'rgba(124,58,237,0.12)',
  trend,
  accent = '#7c3aed',
}: StatsCardProps) {
  return (
    <div style={{
      background: '#18181b',
      border: '1px solid #27272a',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex', flexDirection: 'column', gap: '12px',
      transition: 'border-color 0.15s',
      position: 'relative', overflow: 'hidden',
    }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3f3f46')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#27272a')}
    >
      {/* Subtle top accent */}
      <div style={{
        position: 'absolute', top: 0, left: '20px', right: '20px', height: '1px',
        background: `linear-gradient(90deg, transparent, ${accent}40, transparent)`,
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: '#71717a', fontSize: '12px', fontWeight: '500', margin: 0 }}>{title}</p>
          <p style={{ color: '#fafafa', fontSize: '26px', fontWeight: '700', margin: '4px 0 0', letterSpacing: '-0.5px' }}>
            {value}
          </p>
        </div>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={17} style={{ color: iconColor }} />
        </div>
      </div>

      {(description || trend) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {trend ? (
            <>
              {trend.value >= 0
                ? <TrendingUp size={12} style={{ color: '#10b981' }} />
                : <TrendingDown size={12} style={{ color: '#ef4444' }} />}
              <span style={{ fontSize: '11px', fontWeight: '500', color: trend.value >= 0 ? '#10b981' : '#ef4444' }}>
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
              <span style={{ fontSize: '11px', color: '#52525b' }}>{trend.label}</span>
            </>
          ) : (
            <p style={{ fontSize: '11px', color: '#52525b', margin: 0 }}>{description}</p>
          )}
        </div>
      )}
    </div>
  )
}
