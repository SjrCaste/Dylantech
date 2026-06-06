'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Plus, Layers, Edit, Trash2, Loader2, Save, X, Search, Package } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { TagInput } from '@/components/admin/tag-input'
import { slugify } from '@/lib/utils/slugify'
import type { Combo, Product } from '@/lib/types/admin'

const comboSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1),
  description: z.string().optional(),
  individual_price: z.number().min(0),
  combo_price: z.number().min(0),
  savings_display: z.string().optional(),
  benefits: z.array(z.string()),
  is_active: z.boolean(),
  display_order: z.number().int(),
})

type ComboFormData = z.infer<typeof comboSchema>

interface ComboProduct { product_id: string; quantity: number; product?: Product }

export default function CombosPage() {
  const [combos, setCombos] = useState<Combo[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Combo | null>(null)
  const [comboProducts, setComboProducts] = useState<ComboProduct[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [saving, setSaving] = useState(false)

  const form = useForm<ComboFormData>({
    resolver: zodResolver(comboSchema),
    defaultValues: { name: '', slug: '', description: '', individual_price: 0, combo_price: 0, savings_display: '', benefits: [], is_active: true, display_order: 0 },
  })

  async function fetchData() {
    setLoading(true)
    const [combosRes, productsRes] = await Promise.all([
      fetch('/api/admin/combos'),
      fetch('/api/admin/products?limit=200'),
    ])
    const [combosData, productsData] = await Promise.all([combosRes.json(), productsRes.json()])
    setCombos(combosData.data ?? [])
    setAllProducts(productsData.data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const name = form.watch('name')
  useEffect(() => { if (!editingCombo) form.setValue('slug', slugify(name)) }, [name, editingCombo])

  function openDialog(combo?: Combo) {
    setEditingCombo(combo ?? null)
    form.reset(combo
      ? { name: combo.name, slug: combo.slug, description: combo.description ?? '', individual_price: combo.individual_price, combo_price: combo.combo_price, savings_display: combo.savings_display ?? '', benefits: combo.benefits, is_active: combo.is_active, display_order: combo.display_order }
      : { name: '', slug: '', description: '', individual_price: 0, combo_price: 0, savings_display: '', benefits: [], is_active: true, display_order: 0 }
    )
    setComboProducts((combo?.combo_products ?? []).map((cp: any) => ({
      product_id: cp.product_id,
      quantity: cp.quantity,
      product: cp.product,
    })))
    setDialogOpen(true)
  }

  function addProduct(product: Product) {
    if (comboProducts.some((cp) => cp.product_id === product.id)) return
    setComboProducts((prev) => [...prev, { product_id: product.id, quantity: 1, product }])
    setProductSearch('')
  }

  function removeProduct(productId: string) {
    setComboProducts((prev) => prev.filter((cp) => cp.product_id !== productId))
  }

  function updateQuantity(productId: string, quantity: number) {
    setComboProducts((prev) => prev.map((cp) => cp.product_id === productId ? { ...cp, quantity } : cp))
  }

  async function onSubmit(data: ComboFormData) {
    setSaving(true)
    const payload = { ...data, products: comboProducts.map(({ product_id, quantity }) => ({ product_id, quantity })) }
    const url = editingCombo ? `/api/admin/combos/${editingCombo.id}` : '/api/admin/combos'
    const method = editingCombo ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      toast.success(editingCombo ? 'Combo actualizado' : 'Combo creado')
      setDialogOpen(false)
      fetchData()
    } else {
      const json = await res.json()
      toast.error(json.error ?? 'Error al guardar')
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const res = await fetch(`/api/admin/combos/${deleteTarget.id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Combo eliminado'); fetchData() }
    else toast.error('Error al eliminar')
    setDeleteTarget(null)
  }

  const filteredProducts = allProducts.filter((p) =>
    productSearch.length > 1 && p.name.toLowerCase().includes(productSearch.toLowerCase()) && !comboProducts.some((cp) => cp.product_id === p.id)
  )

  const savings = (form.watch('individual_price') - form.watch('combo_price'))

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Combos</h1>
          <p className="text-sm text-zinc-400 mt-0.5">{combos.length} combo{combos.length !== 1 ? 's' : ''}</p>
        </div>
        <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white" onClick={() => openDialog()}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Nuevo combo
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-52 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />)}
        </div>
      ) : combos.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
          <Layers className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-zinc-500">No hay combos</p>
          <Button size="sm" className="mt-4 bg-violet-600 hover:bg-violet-700 text-white" onClick={() => openDialog()}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Crear primer combo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {combos.map((combo) => (
            <div key={combo.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 flex items-center justify-center relative">
                {combo.image ? (
                  <img src={combo.image} alt={combo.name} className="w-full h-full object-cover" />
                ) : (
                  <Layers className="w-10 h-10 text-violet-300" />
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge className={combo.is_active ? 'bg-emerald-100 text-emerald-700 border-0 text-[10px]' : 'bg-zinc-100 text-zinc-500 border-0 text-[10px]'}>
                    {combo.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{combo.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold text-violet-600">${combo.combo_price.toLocaleString('es-AR')}</span>
                  <span className="text-xs text-zinc-400 line-through">${combo.individual_price.toLocaleString('es-AR')}</span>
                  {savings > 0 && <span className="text-xs text-emerald-600 font-medium">-${savings.toLocaleString('es-AR')}</span>}
                </div>
                {combo.combo_products && combo.combo_products.length > 0 && (
                  <p className="text-xs text-zinc-400 mt-1">{combo.combo_products.length} producto{combo.combo_products.length !== 1 ? 's' : ''}</p>
                )}
                <div className="flex items-center gap-1 mt-3">
                  <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => openDialog(combo)}>
                    <Edit className="w-3 h-3 mr-1" /> Editar
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => setDeleteTarget(combo)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCombo ? 'Editar combo' : 'Nuevo combo'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs">Nombre <span className="text-red-500">*</span></Label>
                <Input {...form.register('name')} placeholder="Ej: Kit Oficina Completo" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Precio individual ($)</Label>
                <Input {...form.register('individual_price', { valueAsNumber: true })} type="number" placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Precio combo ($)</Label>
                <Input {...form.register('combo_price', { valueAsNumber: true })} type="number" placeholder="0" />
              </div>
            </div>

            {savings > 0 && (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400">
                ✓ El cliente ahorra ${savings.toLocaleString('es-AR')} ({Math.round((savings / form.watch('individual_price')) * 100)}%)
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs">Descripción</Label>
              <Textarea {...form.register('description')} rows={2} className="resize-none text-sm" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Beneficios del combo</Label>
              <TagInput value={form.watch('benefits')} onChange={(v) => form.setValue('benefits', v)} placeholder="Ej: Garantía extendida" />
            </div>

            {/* Products selector */}
            <div className="space-y-2">
              <Label className="text-xs">Productos incluidos</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                <Input
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Buscar producto para agregar..."
                  className="pl-9 text-sm"
                />
              </div>
              {filteredProducts.length > 0 && (
                <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg max-h-36 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredProducts.slice(0, 8).map((p) => (
                    <button key={p.id} type="button" onClick={() => addProduct(p)} className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                      <Package className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="text-xs text-zinc-700 dark:text-zinc-300 flex-1">{p.name}</span>
                      <span className="text-xs text-zinc-400">${p.price.toLocaleString('es-AR')}</span>
                    </button>
                  ))}
                </div>
              )}

              {comboProducts.length > 0 && (
                <div className="space-y-1.5">
                  {comboProducts.map((cp) => (
                    <div key={cp.product_id} className="flex items-center gap-2 p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                      <Package className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="text-xs text-zinc-700 dark:text-zinc-300 flex-1 truncate">{cp.product?.name ?? cp.product_id}</span>
                      <Input
                        type="number"
                        value={cp.quantity}
                        onChange={(e) => updateQuantity(cp.product_id, parseInt(e.target.value) || 1)}
                        className="w-16 h-7 text-xs text-center"
                        min={1}
                      />
                      <span className="text-[10px] text-zinc-400">uds.</span>
                      <button type="button" onClick={() => removeProduct(cp.product_id)} className="text-red-400 hover:text-red-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={form.watch('is_active')} onCheckedChange={(v) => form.setValue('is_active', v)} />
                <Label className="text-xs">Activo</Label>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <Label className="text-xs">Orden:</Label>
                <Input {...form.register('display_order', { valueAsNumber: true })} type="number" className="w-20 h-7 text-xs" />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={saving} className="bg-violet-600 hover:bg-violet-700 text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-1.5" />}
                {saving ? 'Guardando...' : 'Guardar combo'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)} onConfirm={handleDelete} title={`Eliminar "${deleteTarget?.name}"`} description="El combo será eliminado permanentemente." />
    </div>
  )
}
