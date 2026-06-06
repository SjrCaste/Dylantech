'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Plus, Image, Edit, Trash2, Loader2, Save, Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import type { Banner } from '@/lib/types/admin'

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null)
  const [saving, setSaving] = useState(false)
  const [bannerType, setBannerType] = useState<'hero' | 'secondary'>('hero')

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: { type: 'hero' as const, image: '', title: '', subtitle: '', button_text: '', button_url: '', is_active: true, display_order: 0 },
  })

  async function fetchBanners() {
    setLoading(true)
    const res = await fetch('/api/admin/banners')
    const json = await res.json()
    setBanners(json.data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchBanners() }, [])

  function openDialog(banner?: Banner) {
    setEditingBanner(banner ?? null)
    setBannerType((banner?.type as any) ?? 'hero')
    reset(banner
      ? { type: banner.type, image: banner.image ?? '', title: banner.title ?? '', subtitle: banner.subtitle ?? '', button_text: banner.button_text ?? '', button_url: banner.button_url ?? '', is_active: banner.is_active, display_order: banner.display_order }
      : { type: 'hero', image: '', title: '', subtitle: '', button_text: '', button_url: '', is_active: true, display_order: 0 }
    )
    setDialogOpen(true)
  }

  async function onSubmit(data: any) {
    setSaving(true)
    const url = editingBanner ? `/api/admin/banners/${editingBanner.id}` : '/api/admin/banners'
    const method = editingBanner ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, type: bannerType }) })
    if (res.ok) {
      toast.success(editingBanner ? 'Banner actualizado' : 'Banner creado')
      setDialogOpen(false)
      fetchBanners()
    } else toast.error('Error al guardar')
    setSaving(false)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const res = await fetch(`/api/admin/banners/${deleteTarget.id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Banner eliminado'); fetchBanners() }
    else toast.error('Error al eliminar')
    setDeleteTarget(null)
  }

  async function toggleActive(banner: Banner) {
    await fetch(`/api/admin/banners/${banner.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !banner.is_active }),
    })
    fetchBanners()
  }

  const heroBanners = banners.filter((b) => b.type === 'hero')
  const secondaryBanners = banners.filter((b) => b.type === 'secondary')

  function BannerCard({ banner }: { banner: Banner }) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="h-36 bg-zinc-100 dark:bg-zinc-800 relative">
          {banner.image ? (
            <img src={banner.image} alt={banner.title ?? ''} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image className="w-8 h-8 text-zinc-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-3">
            {banner.title && <p className="text-white font-semibold text-sm truncate">{banner.title}</p>}
            {banner.subtitle && <p className="text-white/80 text-xs truncate">{banner.subtitle}</p>}
          </div>
          <div className="absolute top-2 left-2">
            <Badge className={banner.is_active ? 'bg-emerald-100 text-emerald-700 border-0 text-[10px]' : 'bg-zinc-800 text-zinc-400 border-0 text-[10px]'}>
              {banner.is_active ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
        <div className="p-3 flex items-center gap-1">
          <button onClick={() => toggleActive(banner)} className="p-1.5 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            {banner.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => openDialog(banner)}>
            <Edit className="w-3 h-3 mr-1" /> Editar
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => setDeleteTarget(banner)}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Banners</h1>
          <p className="text-sm text-zinc-400 mt-0.5">{banners.length} banner{banners.length !== 1 ? 's' : ''}</p>
        </div>
        <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white" onClick={() => openDialog()}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Nuevo banner
        </Button>
      </div>

      {/* Hero banners */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
          Banner principal (Hero)
        </h2>
        {loading ? (
          <div className="h-48 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
        ) : heroBanners.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 p-8 text-center">
            <Image className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            <p className="text-sm text-zinc-400">Sin banner principal</p>
            <Button size="sm" variant="ghost" className="mt-2 text-violet-600" onClick={() => { setBannerType('hero'); openDialog() }}>Crear banner hero</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {heroBanners.map((b) => <BannerCard key={b.id} banner={b} />)}
          </div>
        )}
      </div>

      {/* Secondary banners */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
          Banners secundarios
        </h2>
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {secondaryBanners.map((b) => <BannerCard key={b.id} banner={b} />)}
            <button
              onClick={() => { setBannerType('secondary'); openDialog() }}
              className="h-full min-h-[176px] rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center gap-2 text-zinc-400 hover:border-violet-400 hover:text-violet-500 transition-colors"
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs">Agregar banner</span>
            </button>
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingBanner ? 'Editar banner' : 'Nuevo banner'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Tipo de banner</Label>
              <Select value={bannerType} onValueChange={(v) => setBannerType(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">Hero (principal)</SelectItem>
                  <SelectItem value="secondary">Secundario</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">URL de la imagen</Label>
              <Input {...register('image')} placeholder="https://..." />
              {watch('image') && <img src={watch('image')} alt="" className="w-full h-24 object-cover rounded-lg mt-1" onError={(e) => (e.currentTarget.style.display = 'none')} />}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Título</Label>
              <Input {...register('title')} placeholder="Ej: Productos de calidad" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Subtítulo</Label>
              <Input {...register('subtitle')} placeholder="Ej: Envíos a todo el país" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Texto del botón</Label>
                <Input {...register('button_text')} placeholder="Ver catálogo" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">URL del botón</Label>
                <Input {...register('button_url')} placeholder="#productos" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={watch('is_active')} onCheckedChange={(v) => setValue('is_active', v)} />
                <Label className="text-xs">Activo</Label>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <Label className="text-xs">Orden:</Label>
                <Input {...register('display_order', { valueAsNumber: true })} type="number" className="w-20 h-7 text-xs" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={saving} className="bg-violet-600 hover:bg-violet-700 text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-1.5" />}
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)} onConfirm={handleDelete} title={`Eliminar banner`} description="El banner será eliminado permanentemente." />
    </div>
  )
}
