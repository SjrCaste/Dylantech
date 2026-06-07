'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import {
  Plus, Package, Edit, Trash2, Star, Tag, AlertCircle,
  CheckCircle2, Eye, EyeOff, Download, Filter, Search, X
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTable, createSelectColumn } from '@/components/admin/data-table'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import type { Product } from '@/lib/types/admin'

// ─── Mobile card ────────────────────────────────────────────────────────────

function MobileProductCard({
  product,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
}: {
  product: Product
  onDelete: (p: Product) => void
  onToggleStatus: (p: Product) => void
  onToggleFeatured: (p: Product) => void
}) {
  const img =
    Array.isArray(product.images) && product.images.length > 0
      ? (product.images.find((i: any) => i.is_primary)?.url ?? product.images[0]?.url)
      : null

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center gap-3 active:bg-zinc-800 transition-colors">
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-lg bg-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
        {img ? (
          <img src={img} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <Package className="w-5 h-5 text-zinc-500" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-white truncate leading-tight">{product.name}</p>
        {product.sku && (
          <p className="text-[10px] text-zinc-500 font-mono">{product.sku}</p>
        )}
        <p className="text-violet-400 font-bold text-base leading-tight mt-0.5">
          ${product.price.toLocaleString('es-AR')}
          {product.promotional_price && (
            <span className="text-xs text-zinc-500 line-through font-normal ml-1.5">
              ${product.promotional_price.toLocaleString('es-AR')}
            </span>
          )}
        </p>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <button onClick={() => onToggleStatus(product)}>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
              product.status === 'available'
                ? 'bg-emerald-950/60 text-emerald-400'
                : 'bg-red-950/60 text-red-400'
            }`}>
              {product.status === 'available' ? 'Disponible' : 'Sin stock'}
            </span>
          </button>
          {product.is_featured && (
            <span className="text-[10px] text-amber-400">★ Dest.</span>
          )}
          {product.is_new && (
            <span className="text-[10px] text-sky-400">Nuevo</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <Link href={`/admin/products/${product.id}`}>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-800 text-zinc-300 hover:bg-violet-600 hover:text-white transition-colors active:scale-95">
            <Edit className="w-4 h-4" />
          </button>
        </Link>
        <button
          onClick={() => onDelete(product)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-800 text-zinc-500 hover:bg-red-600 hover:text-white transition-colors active:scale-95"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

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
  const [mobileSearch, setMobileSearch] = useState('')
  const [showMobileSearch, setShowMobileSearch] = useState(false)

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
      toast.success(`Estado: ${newStatus === 'available' ? 'Disponible' : 'Sin stock'}`)
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

  function handleMobileSearch(e: React.FormEvent) {
    e.preventDefault()
    if (mobileSearch.trim()) {
      router.push(`/admin/products?q=${encodeURIComponent(mobileSearch.trim())}`)
    } else {
      router.push('/admin/products')
    }
  }

  // Filtered mobile list
  const mobileProducts = mobileSearch
    ? products.filter(p =>
        p.name.toLowerCase().includes(mobileSearch.toLowerCase()) ||
        p.sku?.toLowerCase().includes(mobileSearch.toLowerCase())
      )
    : products

  const columns: ColumnDef<Product>[] = [
    createSelectColumn<Product>(),
    {
      id: 'product',
      header: 'Producto',
      accessorKey: 'name',
      cell: ({ row }) => {
        const product = row.original
        const img = Array.isArray(product.images) && product.images.length > 0
          ? product.images.find((i: any) => i.is_primary)?.url ?? product.images[0]?.url
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
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">Productos</h1>
          <p className="text-xs sm:text-sm text-zinc-400">{total} producto{total !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile search toggle */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-300"
          >
            {showMobileSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>
          <Button variant="outline" size="sm" asChild className="hidden sm:flex">
            <Link href="/api/admin/export?type=products" target="_blank">
              <Download className="w-4 h-4 mr-1.5" />
              Exportar
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
            <Link href="/admin/products/new">
              <Plus className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Nuevo producto</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile search bar */}
      {showMobileSearch && (
        <form onSubmit={handleMobileSearch} className="md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              autoFocus
              type="text"
              placeholder="Buscar producto o SKU..."
              value={mobileSearch}
              onChange={e => setMobileSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-violet-500"
            />
          </div>
        </form>
      )}

      {/* Mobile filters */}
      <div className="flex gap-2 md:hidden overflow-x-auto pb-1 scrollbar-hide">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="h-8 text-xs shrink-0 w-auto min-w-[110px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="out_of_stock">Sin stock</SelectItem>
          </SelectContent>
        </Select>
        <Select value={featuredFilter} onValueChange={(v) => setFeaturedFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="h-8 text-xs shrink-0 w-auto min-w-[110px]">
            <SelectValue placeholder="Destacados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Destacados</SelectItem>
          </SelectContent>
        </Select>
        {(statusFilter || featuredFilter) && (
          <button
            onClick={() => { setStatusFilter(''); setFeaturedFilter('') }}
            className="text-xs text-zinc-400 shrink-0 px-2"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* ── Mobile card list ── */}
      <div className="md:hidden space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center gap-3 animate-pulse">
              <div className="w-14 h-14 rounded-lg bg-zinc-800 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-zinc-800 rounded w-3/4" />
                <div className="h-4 bg-zinc-800 rounded w-1/3" />
                <div className="h-3 bg-zinc-800 rounded w-1/4" />
              </div>
            </div>
          ))
        ) : mobileProducts.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No hay productos</p>
            <Link href="/admin/products/new">
              <button className="mt-3 text-violet-400 text-sm">+ Crear producto</button>
            </Link>
          </div>
        ) : (
          mobileProducts.map(product => (
            <MobileProductCard
              key={product.id}
              product={product}
              onDelete={setDeleteTarget}
              onToggleStatus={toggleStatus}
              onToggleFeatured={toggleFeatured}
            />
          ))
        )}
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden md:block space-y-4">
        {/* Desktop Filters */}
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
      </div>

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
