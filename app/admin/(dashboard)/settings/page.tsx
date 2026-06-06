'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Save, Loader2, Settings, Globe, Phone, Mail, AtSign, Share2, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { AppSettings } from '@/lib/types/admin'

const defaultSettings: AppSettings = {
  company_name: '',
  whatsapp: '',
  phone: '',
  email: '',
  address: '',
  instagram: '',
  facebook: '',
  logo: '',
  favicon: '',
  currency: 'ARS',
  currency_symbol: '$',
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, watch } = useForm<AppSettings>({
    defaultValues: defaultSettings,
  })

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then(({ data }) => {
        reset({ ...defaultSettings, ...data })
        setLoading(false)
      })
  }, [reset])

  async function onSubmit(data: AppSettings) {
    setSaving(true)
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) toast.success('Configuración guardada correctamente')
    else toast.error('Error al guardar la configuración')
    setSaving(false)
  }

  const section = (icon: React.ReactNode, title: string, children: React.ReactNode) => (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center">{icon}</div>
        <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{title}</h3>
      </div>
      <Separator />
      {children}
    </div>
  )

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />)}
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Configuración General</h1>
          <p className="text-sm text-zinc-400 mt-0.5">Información de tu negocio y preferencias del catálogo</p>
        </div>
        <Button onClick={handleSubmit(onSubmit)} disabled={saving} className="bg-violet-600 hover:bg-violet-700 text-white">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {section(
          <Store className="w-4 h-4 text-violet-600" />,
          'Información del negocio',
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-xs">Nombre de la empresa</Label>
              <Input {...register('company_name')} placeholder="Mi Tienda" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">URL del logo</Label>
              <Input {...register('logo')} placeholder="https://..." />
              {watch('logo') && <img src={watch('logo')} alt="Logo" className="h-12 object-contain rounded mt-1" onError={(e) => (e.currentTarget.style.display = 'none')} />}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">URL del favicon</Label>
              <Input {...register('favicon')} placeholder="https://..." />
            </div>
          </div>
        )}

        {section(
          <Phone className="w-4 h-4 text-violet-600" />,
          'Contacto',
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">WhatsApp</Label>
              <Input {...register('whatsapp')} placeholder="+54 9 11 0000-0000" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Teléfono</Label>
              <Input {...register('phone')} placeholder="+54 11 0000-0000" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input {...register('email')} type="email" placeholder="contacto@tienda.com" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Dirección</Label>
              <Input {...register('address')} placeholder="Buenos Aires, Argentina" />
            </div>
          </div>
        )}

        {section(
          <Globe className="w-4 h-4 text-violet-600" />,
          'Redes sociales',
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1.5"><AtSign className="w-3 h-3" /> Instagram</Label>
              <Input {...register('instagram')} placeholder="@mitienda" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1.5"><Share2 className="w-3 h-3" /> Facebook</Label>
              <Input {...register('facebook')} placeholder="mitienda" />
            </div>
          </div>
        )}

        {section(
          <Settings className="w-4 h-4 text-violet-600" />,
          'Moneda y formato',
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Moneda</Label>
              <Input {...register('currency')} placeholder="ARS" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Símbolo</Label>
              <Input {...register('currency_symbol')} placeholder="$" />
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
