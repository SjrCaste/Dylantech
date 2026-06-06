'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Plus, MessageSquare, Edit, Trash2, Loader2, Save, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import type { Testimonial } from '@/lib/types/admin'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null)
  const [rating, setRating] = useState(5)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: { name: '', photo: '', comment: '', date: new Date().toISOString().split('T')[0], is_active: true, display_order: 0 },
  })

  async function fetchData() {
    setLoading(true)
    const res = await fetch('/api/admin/testimonials')
    const json = await res.json()
    setTestimonials(json.data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function openDialog(item?: Testimonial) {
    setEditingItem(item ?? null)
    setRating(item?.rating ?? 5)
    reset(item
      ? { name: item.name, photo: item.photo ?? '', comment: item.comment, date: item.date, is_active: item.is_active, display_order: item.display_order }
      : { name: '', photo: '', comment: '', date: new Date().toISOString().split('T')[0], is_active: true, display_order: 0 }
    )
    setDialogOpen(true)
  }

  async function onSubmit(data: any) {
    setSaving(true)
    const payload = { ...data, rating }
    const url = editingItem ? `/api/admin/testimonials/${editingItem.id}` : '/api/admin/testimonials'
    const method = editingItem ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) { toast.success(editingItem ? 'Testimonio actualizado' : 'Testimonio creado'); setDialogOpen(false); fetchData() }
    else toast.error('Error al guardar')
    setSaving(false)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const res = await fetch(`/api/admin/testimonials/${deleteTarget.id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Testimonio eliminado'); fetchData() }
    setDeleteTarget(null)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Testimonios</h1>
          <p className="text-sm text-zinc-400 mt-0.5">{testimonials.length} testimonio{testimonials.length !== 1 ? 's' : ''}</p>
        </div>
        <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white" onClick={() => openDialog()}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Nuevo testimonio
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />)}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
          <MessageSquare className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-zinc-500">No hay testimonios</p>
          <Button size="sm" className="mt-4 bg-violet-600 hover:bg-violet-700 text-white" onClick={() => openDialog()}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Agregar testimonio
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className={`bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-3 ${!t.is_active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={t.photo ?? ''} />
                    <AvatarFallback className="bg-violet-100 text-violet-700 text-xs font-bold">{t.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{t.name}</p>
                    <p className="text-[10px] text-zinc-400">{t.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-200'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 flex-1 line-clamp-3 italic">"{t.comment}"</p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => openDialog(t)}>
                  <Edit className="w-3 h-3 mr-1" /> Editar
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => setDeleteTarget(t)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingItem ? 'Editar testimonio' : 'Nuevo testimonio'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Nombre <span className="text-red-500">*</span></Label>
                <Input {...register('name')} placeholder="María García" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Fecha</Label>
                <Input {...register('date')} type="date" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">URL de foto</Label>
              <Input {...register('photo')} placeholder="https://..." />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Calificación</Label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} type="button" onClick={() => setRating(i + 1)}>
                    <Star className={`w-6 h-6 transition-colors ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-200 hover:text-amber-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Comentario <span className="text-red-500">*</span></Label>
              <Textarea {...register('comment')} placeholder="Excelente producto, muy recomendable..." rows={3} className="resize-none" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={watch('is_active')} onCheckedChange={(v) => setValue('is_active', v)} />
                <Label className="text-xs">Visible</Label>
              </div>
              <div className="flex items-center gap-2">
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
      <DeleteDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)} onConfirm={handleDelete} title="Eliminar testimonio" description="El testimonio será eliminado permanentemente." />
    </div>
  )
}
