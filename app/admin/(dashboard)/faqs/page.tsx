'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Plus, HelpCircle, Edit, Trash2, Loader2, Save, ChevronDown, ChevronRight, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import type { FAQ } from '@/lib/types/admin'

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FAQ | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<FAQ | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: { question: '', answer: '', is_active: true, display_order: 0 },
  })

  async function fetchData() {
    setLoading(true)
    const res = await fetch('/api/admin/faqs')
    const json = await res.json()
    setFaqs(json.data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function openDialog(item?: FAQ) {
    setEditingItem(item ?? null)
    reset(item
      ? { question: item.question, answer: item.answer, is_active: item.is_active, display_order: item.display_order }
      : { question: '', answer: '', is_active: true, display_order: faqs.length }
    )
    setDialogOpen(true)
  }

  async function onSubmit(data: any) {
    setSaving(true)
    const url = editingItem ? `/api/admin/faqs/${editingItem.id}` : '/api/admin/faqs'
    const method = editingItem ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (res.ok) { toast.success(editingItem ? 'FAQ actualizada' : 'FAQ creada'); setDialogOpen(false); fetchData() }
    else toast.error('Error al guardar')
    setSaving(false)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const res = await fetch(`/api/admin/faqs/${deleteTarget.id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('FAQ eliminada'); fetchData() }
    setDeleteTarget(null)
  }

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Preguntas Frecuentes</h1>
          <p className="text-sm text-zinc-400 mt-0.5">{faqs.length} pregunta{faqs.length !== 1 ? 's' : ''}</p>
        </div>
        <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white" onClick={() => openDialog()}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Nueva pregunta
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />)}
        </div>
      ) : faqs.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
          <HelpCircle className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-zinc-500">No hay preguntas frecuentes</p>
          <Button size="sm" className="mt-4 bg-violet-600 hover:bg-violet-700 text-white" onClick={() => openDialog()}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Agregar pregunta
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden ${!faq.is_active ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-2 px-4 py-3">
                <GripVertical className="w-4 h-4 text-zinc-300 cursor-grab shrink-0" />
                <button
                  onClick={() => toggleExpanded(faq.id)}
                  className="flex items-center gap-2 flex-1 text-left min-w-0"
                >
                  <span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 flex-1 truncate">{faq.question}</span>
                  {expanded.has(faq.id) ? <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />}
                </button>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openDialog(faq)} className="p-1.5 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteTarget(faq)} className="p-1.5 rounded text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {expanded.has(faq.id) && (
                <div className="px-4 pb-4 pt-0 border-t border-zinc-100 dark:border-zinc-800">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingItem ? 'Editar pregunta' : 'Nueva pregunta frecuente'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Pregunta <span className="text-red-500">*</span></Label>
              <Input {...register('question')} placeholder="¿Cómo hago mi pedido?" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Respuesta <span className="text-red-500">*</span></Label>
              <Textarea {...register('answer')} placeholder="Podés contactarnos por WhatsApp..." rows={4} className="resize-none text-sm" />
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
      <DeleteDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)} onConfirm={handleDelete} title="Eliminar pregunta" description="La pregunta será eliminada permanentemente." />
    </div>
  )
}
