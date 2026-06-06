'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import {
  Plus, Package, Edit, Trash2, Star, Tag, AlertCircle,
  CheckCircle2, Eye, EyeOff, Download, Filter
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTable, createSelectColumn } from '@/components/admin/data-table'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import type { Product } from '@/lib/types/admin'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') ?? '')
  const [featuredFilter, setFeaturedFilter] = useState(searchParams.get('featured') ?? '')
  const [selectedRows, setSelectedRows] = useState<Product[]>([])

  const q = searchParams.get('q') ?? ''

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (statusFilter) params.set('status', statusFilter)
    if (featuredFilter) params.set('featured', featuredFilter)
    params.set('limit', '100')

    const res = await fetch(`/api/admin/products?${params}`)
    const json = await res.json()
    setProducts(json.data ?? [])
    setTotal(json.count ?? 0)
    setLoading(false)
  }, [q, statusFilter, featuredFilter])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  async function handleDelete() {
    if (!deleteTarget) return
    const res = await fetch(`/api/admin/products/${deleteTarget.id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Producto eliminado')
      fetchProducts()
    } else {
      toast.error('Error al eliminar el producto')
    }
    setDeleteTarget(null)
  }

  async function toggleStatus(product: Product) {
    const newStatus = product.status === 'available' ? 'out_of_stock' : 'available'
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      toast.success(`Estado actualizado a "${newStatus === 'available' ? 'Disponible' : 'Sin stock'}"`)
      fetchProducts()
    }
  }

  async function toggleFeatured(product: Product) {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_featured: !product.is_featured }),
    })
    if (res.ok) {
      toast.success(product.is_featured ? 'Quitado de destacados' : 'Marcado como destacado')
      fetchProducts()
    }
  }

  const columns: ColumnDef<Product>[] = [
    createSelectColumn<Product>(),
    {
      id: 'product',
      header: 'Producto',
      accessorKey: 'name',
      cell: ({ row }) => {
        const product = row.original
        const img = Array.isArray(product.images) && product.images.length > 0
          ? product.images.find(i => i.is_primary)?.url ?? product.images[0]?.url
          : null
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0">
              {img ? (
                <img src={img} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">{product.name}</p>
              {product.sku && <p className="text-[10px] text-zinc-400 font-mono">{product.sku}</p>}
            </div>
          </div>
        )
      },
    },
    {
      id: 'category',
      header: 'Categoría',
      cell: ({ row }) => (
        <span className="text-xs text-zinc-500">
          {(row.original as any).category?.name ?? '—'}
        </span>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Precio',
      cell: ({ row }) => (
        <div>
          <span className="text-sm font-semibold">${row.original.price.toLocaleString('es-AR')}</span>
          {row.original.promotional_price && (
            <span className="text-xs text-zinc-400 line-through ml-1.5">
              ${row.original.promotional_price.toLocaleString('es-AR')}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <button onClick={() => toggleStatus(row.original)}>
          <Badge
            className={row.original.status === 'available'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-0 text-xs cursor-pointer hover:bg-emerald-200 transition-colors'
              : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-0 text-xs cursor-pointer hover:bg-red-200 transition-colors'
            }
          >
            {row.original.status === 'available' ? 'Disponible' : 'Sin stock'}
          </Badge>
        </button>
      ),
    },
    {
      id: 'badges',
      header: 'Etiquetas',
      cell: ({ row }) => {
        const p = row.original
        return (
          <div className="flex flex-wrap gap-1">
            {p.is_featured && <span className="text-[9px] font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded-full">★ Destacado</span>}
            {p.is_new && <span className="text-[9px] font-medium text-sky-600 bg-sky-50 dark:bg-sky-950/30 px-1.5 py-0.5 rounded-full">Nuevo</span>}
            {p.is_on_sale && <span className="text-[9px] font-medium text-orange-600 bg-orange-50 dark:bg-orange-950/30 px-1.5 py-0.5 rounded-full">Oferta</span>}
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={() => toggleFeatured(row.original)}
            title={row.original.is_featured ? 'Quitar de destacados' : 'Marcar como destacado'}
            className={`p-1.5 rounded transition-colors ${
              row.original.is_featured
                ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                : 'text-zinc-300 hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
          </button>
          <Link href={`/admin/products/${row.original.id}`}>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Edit className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            onClick={() => setDeleteTarget(row.original)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Productos</h1>
          <p className="text-sm text-zinc-400 mt-0.5">{total} producto{total !== 1 ? 's' : ''} en total</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/api/admin/export?type=products" target="_blank">
              <Download className="w-4 h-4 mr-1.5" />
              Exportar
            </Link>
          </Button>
          <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white">
            <Link href="/admin/products/new">
              <Plus className="w-4 h-4 mr-1.5" />
              Nuevo producto
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="out_of_stock">Sin stock</SelectItem>
          </SelectContent>
        </Select>

        <Select value={featuredFilter} onValueChange={(v) => setFeaturedFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue placeholder="Destacados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Solo destacados</SelectItem>
          </SelectContent>
        </Select>

        {(statusFilter || featuredFilter || q) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-zinc-400 hover:text-zinc-600"
            onClick={() => {
              setStatusFilter('')
              setFeaturedFilter('')
              router.push('/admin/products')
            }}
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        searchPlaceholder="Buscar por nombre o SKU..."
        searchColumn="name"
        pageSize={20}
        onRowSelectionChange={setSelectedRows}
        emptyMessage="No hay productos"
        emptyDescription="Creá tu primer producto para empezar"
      />

      {/* Delete dialog */}
      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Eliminar "${deleteTarget?.name}"`}
        description="Esta acción es irreversible. El producto será eliminado permanentemente del catálogo."
      />
    </div>
  )
}
