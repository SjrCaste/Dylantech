'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Plus, FolderOpen, Edit, Trash2, Eye, EyeOff, Loader2,
  ChevronRight, ChevronDown, Tag, Save
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { slugify } from '@/lib/utils/slugify'
import type { Category, Subcategory } from '@/lib/types/admin'

const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1, 'El slug es requerido').regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  description: z.string().optional(),
  display_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
})

const subcategorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1, 'El slug es requerido').regex(/^[a-z0-9-]+$/, 'Solo letras, números y guiones'),
  category_id: z.string().min(1, 'La categoría es requerida'),
  display_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
})

type CategoryForm = z.infer<typeof categorySchema>
type SubcategoryForm = z.infer<typeof subcategorySchema>

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryDialog, setCategoryDialog] = useState(false)
  const [subcategoryDialog, setSubcategoryDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null)
  const [deleteSubcategory, setDeleteSubcategory] = useState<Subcategory | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  const catForm = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', slug: '', description: '', display_order: 0, is_visible: true },
  })

  const subForm = useForm<SubcategoryForm>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: { name: '', slug: '', category_id: '', display_order: 0, is_visible: true },
  })

  async function fetchAll() {
    setLoading(true)
    const [catRes, subRes] = await Promise.all([
      fetch('/api/admin/categories'),
      fetch('/api/admin/subcategories'),
    ])
    const [catData, subData] = await Promise.all([catRes.json(), subRes.json()])
    setCategories(catData.data ?? [])
    setSubcategories(subData.data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  function openCategoryDialog(cat?: Category) {
    setEditingCategory(cat ?? null)
    catForm.reset(cat
      ? { name: cat.name, slug: cat.slug, description: cat.description ?? '', display_order: cat.display_order, is_visible: cat.is_visible }
      : { name: '', slug: '', description: '', display_order: 0, is_visible: true }
    )
    setCategoryDialog(true)
  }

  function openSubcategoryDialog(sub?: Subcategory, catId?: string) {
    setEditingSubcategory(sub ?? null)
    subForm.reset(sub
      ? { name: sub.name, slug: sub.slug, category_id: sub.category_id, display_order: sub.display_order, is_visible: sub.is_visible }
      : { name: '', slug: '', category_id: catId ?? '', display_order: 0, is_visible: true }
    )
    setSubcategoryDialog(true)
  }

  const catName = catForm.watch('name')
  const subName = subForm.watch('name')

  useEffect(() => {
    if (!editingCategory) catForm.setValue('slug', slugify(catName))
  }, [catName, editingCategory])

  useEffect(() => {
    if (!editingSubcategory) subForm.setValue('slug', slugify(subName))
  }, [subName, editingSubcategory])

  async function saveCategory(data: CategoryForm) {
    setSaving(true)
    const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories'
    const method = editingCategory ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (res.ok) {
      toast.success(editingCategory ? 'Categoría actualizada' : 'Categoría creada')
      setCategoryDialog(false)
      fetchAll()
    } else {
      const json = await res.json()
      toast.error(json.error ?? 'Error al guardar')
    }
    setSaving(false)
  }

  async function saveSubcategory(data: SubcategoryForm) {
    setSaving(true)
    const url = editingSubcategory ? `/api/admin/subcategories/${editingSubcategory.id}` : '/api/admin/subcategories'
    const method = editingSubcategory ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (res.ok) {
      toast.success(editingSubcategory ? 'Subcategoría actualizada' : 'Subcategoría creada')
      setSubcategoryDialog(false)
      fetchAll()
    } else {
      toast.error('Error al guardar la subcategoría')
    }
    setSaving(false)
  }

  async function handleDeleteCategory() {
    if (!deleteCategory) return
    const res = await fetch(`/api/admin/categories/${deleteCategory.id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Categoría eliminada'); fetchAll() }
    else toast.error('Error al eliminar')
    setDeleteCategory(null)
  }

  async function handleDeleteSubcategory() {
    if (!deleteSubcategory) return
    const res = await fetch(`/api/admin/subcategories/${deleteSubcategory.id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Subcategoría eliminada'); fetchAll() }
    else toast.error('Error al eliminar')
    setDeleteSubcategory(null)
  }

  async function toggleCategoryVisibility(cat: Category) {
    await fetch(`/api/admin/categories/${cat.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_visible: !cat.is_visible }),
    })
    fetchAll()
  }

  function toggleExpand(catId: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      next.has(catId) ? next.delete(catId) : next.add(catId)
      return next
    })
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Categorías</h1>
          <p className="text-sm text-zinc-400 mt-0.5">{categories.length} categoría{categories.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => openSubcategoryDialog()}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Subcategoría
          </Button>
          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white" onClick={() => openCategoryDialog()}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Categoría
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
          <FolderOpen className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-zinc-500">No hay categorías</p>
          <p className="text-xs text-zinc-400 mt-1">Creá tu primera categoría para organizar el catálogo</p>
          <Button size="sm" className="mt-4 bg-violet-600 hover:bg-violet-700 text-white" onClick={() => openCategoryDialog()}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Crear categoría
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => {
            const catSubs = subcategories.filter((s) => s.category_id === cat.id)
            const expanded = expandedCategories.has(cat.id)

            return (
              <div key={cat.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <button
                    onClick={() => toggleExpand(cat.id)}
                    className="text-zinc-400 hover:text-zinc-600 transition-colors shrink-0"
                  >
                    {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center shrink-0">
                    <FolderOpen className="w-4 h-4 text-violet-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{cat.name}</span>
                      {!cat.is_visible && <Badge variant="secondary" className="text-[10px] h-4">Oculta</Badge>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-zinc-400">{cat.slug}</span>
                      {catSubs.length > 0 && (
                        <span className="text-[10px] text-zinc-400">· {catSubs.length} subcategoría{catSubs.length !== 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openSubcategoryDialog(undefined, cat.id)}
                      className="p-1.5 rounded text-zinc-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
                      title="Agregar subcategoría"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleCategoryVisibility(cat)}
                      className="p-1.5 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      title={cat.is_visible ? 'Ocultar' : 'Mostrar'}
                    >
                      {cat.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => openCategoryDialog(cat)}
                      className="p-1.5 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteCategory(cat)}
                      className="p-1.5 rounded text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subcategories */}
                {expanded && (
                  <div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    {catSubs.length === 0 ? (
                      <div className="px-4 py-3 text-xs text-zinc-400 flex items-center gap-2">
                        <Tag className="w-3 h-3" />
                        Sin subcategorías ·{' '}
                        <button
                          onClick={() => openSubcategoryDialog(undefined, cat.id)}
                          className="text-violet-600 hover:underline"
                        >
                          Agregar
                        </button>
                      </div>
                    ) : (
                      catSubs.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                          <div className="w-4 border-l-2 border-zinc-200 dark:border-zinc-700 ml-3" />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">{sub.name}</span>
                            <span className="text-[10px] font-mono text-zinc-400 ml-2">{sub.slug}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openSubcategoryDialog(sub)}
                              className="p-1 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setDeleteSubcategory(sub)}
                              className="p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Category Dialog */}
      <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Editar categoría' : 'Nueva categoría'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={catForm.handleSubmit(saveCategory)} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Nombre <span className="text-red-500">*</span></Label>
              <Input {...catForm.register('name')} placeholder="Ej: Tecnología" />
              {catForm.formState.errors.name && <p className="text-xs text-red-500">{catForm.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Slug</Label>
              <Input {...catForm.register('slug')} placeholder="tecnologia" className="font-mono text-xs" />
              {catForm.formState.errors.slug && <p className="text-xs text-red-500">{catForm.formState.errors.slug.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Descripción</Label>
              <Textarea {...catForm.register('description')} rows={2} className="resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Orden</Label>
                <Input {...catForm.register('display_order', { valueAsNumber: true })} type="number" />
              </div>
              <div className="flex items-end pb-0.5">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={catForm.watch('is_visible')}
                    onCheckedChange={(v) => catForm.setValue('is_visible', v)}
                  />
                  <Label className="text-xs">Visible</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCategoryDialog(false)}>Cancelar</Button>
              <Button type="submit" disabled={saving} className="bg-violet-600 hover:bg-violet-700 text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Subcategory Dialog */}
      <Dialog open={subcategoryDialog} onOpenChange={setSubcategoryDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSubcategory ? 'Editar subcategoría' : 'Nueva subcategoría'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={subForm.handleSubmit(saveSubcategory)} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Categoría padre <span className="text-red-500">*</span></Label>
              <Select
                value={subForm.watch('category_id')}
                onValueChange={(v) => subForm.setValue('category_id', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Nombre <span className="text-red-500">*</span></Label>
              <Input {...subForm.register('name')} placeholder="Ej: Smartphones" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Slug</Label>
              <Input {...subForm.register('slug')} placeholder="smartphones" className="font-mono text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Orden</Label>
                <Input {...subForm.register('display_order', { valueAsNumber: true })} type="number" />
              </div>
              <div className="flex items-end pb-0.5">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={subForm.watch('is_visible')}
                    onCheckedChange={(v) => subForm.setValue('is_visible', v)}
                  />
                  <Label className="text-xs">Visible</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSubcategoryDialog(false)}>Cancelar</Button>
              <Button type="submit" disabled={saving} className="bg-violet-600 hover:bg-violet-700 text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog open={!!deleteCategory} onOpenChange={(o) => !o && setDeleteCategory(null)} onConfirm={handleDeleteCategory} title={`Eliminar "${deleteCategory?.name}"`} description="Se eliminarán también todas las subcategorías. Los productos quedarán sin categoría." />
      <DeleteDialog open={!!deleteSubcategory} onOpenChange={(o) => !o && setDeleteSubcategory(null)} onConfirm={handleDeleteSubcategory} title={`Eliminar "${deleteSubcategory?.name}"`} description="Esta subcategoría será eliminada permanentemente." />
    </div>
  )
}
