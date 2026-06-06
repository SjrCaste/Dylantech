'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Store, Lock, Mail, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Email o contraseña incorrectos.')
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Left panel — branding */}
      <div style={{
        flex: '0 0 45%',
        background: 'linear-gradient(135deg, #0f0f11 0%, #18181b 50%, #1e0a3c 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
      }}
        className="hidden lg:flex"
      >
        {/* Glow effects */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '280px', height: '280px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
          }}>
            <Store size={20} color="white" />
          </div>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '16px', letterSpacing: '-0.3px' }}>
            Catálogo Admin
          </span>
        </div>

        {/* Center content */}
        <div style={{ position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '100px', padding: '6px 14px', marginBottom: '28px',
          }}>
            <ShieldCheck size={14} color="#a78bfa" />
            <span style={{ color: '#a78bfa', fontSize: '12px', fontWeight: '500' }}>Acceso seguro</span>
          </div>
          <h2 style={{
            color: 'white', fontSize: '36px', fontWeight: '800',
            lineHeight: '1.15', letterSpacing: '-1px', marginBottom: '16px',
          }}>
            Gestioná tu<br />
            <span style={{ background: 'linear-gradient(90deg, #a78bfa, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              catálogo completo
            </span>
          </h2>
          <p style={{ color: '#71717a', fontSize: '15px', lineHeight: '1.6', maxWidth: '320px' }}>
            Administrá productos, categorías, combos, banners y más desde un solo lugar.
          </p>

          {/* Feature list */}
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Gestión completa de productos', 'Panel de analytics en tiempo real', 'Importación y exportación CSV', 'Control de contenido del sitio'].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', flexShrink: 0,
                }} />
                <span style={{ color: '#a1a1aa', fontSize: '13px' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <p style={{ color: '#3f3f46', fontSize: '12px', position: 'relative' }}>
          © 2025 · Panel exclusivo para administradores
        </p>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1,
        background: '#09090b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>

          {/* Mobile logo */}
          <div className="lg:hidden" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(124,58,237,0.4)', marginBottom: '16px',
            }}>
              <Store size={22} color="white" />
            </div>
            <h1 style={{ color: 'white', fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>
              Panel de Administración
            </h1>
            <p style={{ color: '#71717a', fontSize: '14px' }}>Ingresá para gestionar tu catálogo</p>
          </div>

          {/* Form header */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '700', marginBottom: '6px', letterSpacing: '-0.5px' }}>
              Bienvenido de nuevo
            </h2>
            <p style={{ color: '#71717a', fontSize: '14px' }}>
              Ingresá tus credenciales para continuar
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
              <span style={{ color: '#fca5a5', fontSize: '13px' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', color: '#a1a1aa', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="#52525b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  placeholder="admin@tutienda.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: '#18181b', border: '1px solid #27272a',
                    borderRadius: '10px', padding: '11px 14px 11px 40px',
                    color: 'white', fontSize: '14px', outline: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
                  onBlur={(e) => e.target.style.borderColor = '#27272a'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', color: '#a1a1aa', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="#52525b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: '#18181b', border: '1px solid #27272a',
                    borderRadius: '10px', padding: '11px 44px 11px 40px',
                    color: 'white', fontSize: '14px', outline: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
                  onBlur={(e) => e.target.style.borderColor = '#27272a'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex',
                  }}
                >
                  {showPassword
                    ? <EyeOff size={15} color="#52525b" />
                    : <Eye size={15} color="#52525b" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '8px',
                width: '100%',
                background: loading ? '#4c1d95' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                border: 'none', borderRadius: '10px',
                padding: '12px', color: 'white',
                fontSize: '14px', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
                transition: 'opacity 0.15s',
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Ingresando...
                </>
              ) : (
                'Ingresar al panel'
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#3f3f46', fontSize: '12px', marginTop: '32px' }}>
            Panel exclusivo para administradores
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        input::placeholder { color: #52525b; }
      `}</style>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#09090b' }} />}>
      <LoginForm />
    </Suspense>
  )
}
