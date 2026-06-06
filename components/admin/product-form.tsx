'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Save, Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { ImageUploader } from './image-uploader'
import { RichTextEditor } from './rich-text-editor'
import { TagInput } from './tag-input'
import { slugify } from '@/lib/utils/slugify'
import type { Product, Category, Subcategory } from '@/lib/types/admin'

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1, 'El slug es requerido').regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  short_description: z.string().optional(),
  description: z.string().optional(),
  category_id: z.string().optional(),
  subcategory_id: z.string().optional(),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  promotional_price: z.number().optional().nullable(),
  sku: z.string().optional(),
  stock: z.number().int().min(0),
  status: z.enum(['available', 'out_of_stock']),
  tags: z.array(z.string()),
  benefits: z.array(z.string()),
  features: z.array(z.string()),
  usage_instructions: z.string().optional(),
  recommendations: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.array(z.string()),
  is_featured: z.boolean(),
  is_new: z.boolean(),
  is_on_sale: z.boolean(),
  is_best_seller: z.boolean(),
  is_recommended: z.boolean(),
  display_order: z.number().int(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  product?: Product
  categories: Category[]
  subcategories: Subcategory[]
}

export function ProductForm({ product, categories, subcategories }: ProductFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState(product?.images ?? [])
  const [description, setDescription] = useState(product?.description ?? '')
  const [autoSlug, setAutoSlug] = useState(!product)
  const [selectedCategoryId, setSelectedCategoryId] = useState(product?.category_id ?? '')

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? '',
      slug: product?.slug ?? '',
      short_description: product?.short_description ?? '',
      category_id: product?.category_id ?? '',
      subcategory_id: product?.subcategory_id ?? '',
      price: product?.price ?? 0,
      promotional_price: product?.promotional_price ?? null,
      sku: product?.sku ?? '',
      stock: product?.stock ?? 0,
      status: product?.status ?? 'available',
      tags: product?.tags ?? [],
      benefits: product?.benefits ?? [],
      features: product?.features ?? [],
      usage_instructions: product?.usage_instructions ?? '',
      recommendations: product?.recommendations ?? '',
      seo_title: product?.seo_title ?? '',
      seo_description: product?.seo_description ?? '',
      seo_keywords: product?.seo_keywords ?? [],
      is_featured: product?.is_featured ?? false,
      is_new: product?.is_new ?? false,
      is_on_sale: product?.is_on_sale ?? false,
      is_best_seller: product?.is_best_seller ?? false,
      is_recommended: product?.is_recommended ?? false,
      display_order: product?.display_order ?? 0,
    },
  })

  const name = watch('name')

  useEffect(() => {
    if (autoSlug && name) {
      setValue('slug', slugify(name))
    }
  }, [name, autoSlug, setValue])

  const filteredSubcategories = subcategories.filter(
    (sub) => sub.category_id === selectedCategoryId
  )

  async function onSubmit(data: ProductFormData) {
    setSaving(true)
    try {
      const payload = {
        ...data,
        description,
        images,
        promotional_price: data.promotional_price || null,
        category_id: data.category_id || null,
        subcategory_id: data.subcategory_id || null,
      }

      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products'
      const method = product ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (!res.ok) {
        toast.error(json.error ?? 'Error al guardar el producto')
        return
      }

      toast.success(product ? 'Producto actualizado correctamente' : 'Producto creado correctamente')
      router.push('/admin/products')
      router.refresh()
    } catch {
      toast.error('Error inesperado al guardar el producto')
    } finally {
      setSaving(false)
    }
  }

  const formSection = (title: string, children: React.ReactNode) => (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
      <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{title}</h3>
      {children}
    </div>
  )

  const field = (
    label: string,
    name: keyof ProductFormData,
    options?: { required?: boolean; type?: string; placeholder?: string }
  ) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
        {label} {options?.required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        {...register(name as any, { valueAsNumber: options?.type === 'number' })}
        type={options?.type ?? 'text'}
        placeholder={options?.placeholder}
        className={errors[name] ? 'border-red-400' : ''}
      />
      {errors[name] && <p className="text-xs text-red-500">{errors[name]?.message as string}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {product ? 'Editar producto' : 'Nuevo producto'}
          </h1>
          {product && (
            <p className="text-sm text-zinc-400 mt-0.5">ID: {product.id}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" />{product ? 'Actualizar' : 'Crear'} producto</>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <Tabs defaultValue="basic">
            <TabsList className="bg-zinc-100 dark:bg-zinc-800 h-8">
              <TabsTrigger value="basic" className="text-xs h-7">Información</TabsTrigger>
              <TabsTrigger value="content" className="text-xs h-7">Contenido</TabsTrigger>
              <TabsTrigger value="images" className="text-xs h-7">Imágenes</TabsTrigger>
              <TabsTrigger value="seo" className="text-xs h-7">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              {formSection('Información básica', (
                <>
                  {field('Nombre del producto', 'name', { required: true, placeholder: 'Ej: Auriculares Bluetooth Pro' })}

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        URL amigable (slug) <span className="text-red-500">*</span>
                      </Label>
                      <button
                        type="button"
                        onClick={() => setAutoSlug(!autoSlug)}
                        className="text-[10px] text-violet-600 hover:underline"
                      >
                        {autoSlug ? 'Editar manualmente' : 'Auto-generar'}
                      </button>
                    </div>
                    <Input
                      {...register('slug')}
                      disabled={autoSlug}
                      placeholder="auriculares-bluetooth-pro"
                      className={`font-mono text-xs ${errors.slug ? 'border-red-400' : ''} ${autoSlug ? 'bg-zinc-50 dark:bg-zinc-800/50' : ''}`}
                    />
                    {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Descripción corta</Label>
                    <Textarea
                      {...register('short_description')}
                      placeholder="Una frase que resuma el producto..."
                      rows={2}
                      className="resize-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Categoría</Label>
                      <Select
                        value={selectedCategoryId}
                        onValueChange={(val) => {
                          setSelectedCategoryId(val)
                          setValue('category_id', val)
                          setValue('subcategory_id', '')
                        }}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Sin categoría</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Subcategoría</Label>
                      <Select
                        value={watch('subcategory_id') ?? ''}
                        onValueChange={(val) => setValue('subcategory_id', val)}
                        disabled={!selectedCategoryId || filteredSubcategories.length === 0}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder={filteredSubcategories.length === 0 ? 'Sin subcategorías' : 'Seleccionar...'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Sin subcategoría</SelectItem>
                          {filteredSubcategories.map((sub) => (
                            <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              ))}

              {formSection('Precios y stock', (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {field('Precio', 'price', { required: true, type: 'number', placeholder: '0.00' })}
                    {field('Precio promocional', 'promotional_price', { type: 'number', placeholder: '0.00' })}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {field('SKU / Código', 'sku', { placeholder: 'SKU-001' })}
                    {field('Stock', 'stock', { type: 'number', placeholder: '0' })}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Estado</Label>
                    <Select
                      value={watch('status')}
                      onValueChange={(val) => setValue('status', val as 'available' | 'out_of_stock')}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Disponible</SelectItem>
                        <SelectItem value="out_of_stock">Sin stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {field('Orden de visualización', 'display_order', { type: 'number', placeholder: '0' })}
                </>
              ))}
            </TabsContent>

            <TabsContent value="content" className="space-y-4 mt-4">
              {formSection('Descripción completa', (
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Describí el producto en detalle..."
                />
              ))}

              {formSection('Beneficios', (
                <>
                  <p className="text-xs text-zinc-400">Presioná Enter para agregar cada beneficio</p>
                  <TagInput
                    value={watch('benefits')}
                    onChange={(val) => setValue('benefits', val)}
                    placeholder="Ej: Resistente al agua"
                  />
                </>
              ))}

              {formSection('Características', (
                <>
                  <p className="text-xs text-zinc-400">Presioná Enter para agregar cada característica</p>
                  <TagInput
                    value={watch('features')}
                    onChange={(val) => setValue('features', val)}
                    placeholder="Ej: Bluetooth 5.0"
                  />
                </>
              ))}

              {formSection('Instrucciones de uso', (
                <Textarea
                  {...register('usage_instructions')}
                  placeholder="¿Cómo se usa el producto?"
                  rows={3}
                  className="resize-none text-sm"
                />
              ))}

              {formSection('Recomendaciones', (
                <Textarea
                  {...register('recommendations')}
                  placeholder="Recomendaciones para el cliente..."
                  rows={3}
                  className="resize-none text-sm"
                />
              ))}

              {formSection('Etiquetas', (
                <>
                  <p className="text-xs text-zinc-400">Presioná Enter para agregar etiquetas</p>
                  <TagInput
                    value={watch('tags')}
                    onChange={(val) => setValue('tags', val)}
                    placeholder="Ej: wireless, premium"
                  />
                </>
              ))}
            </TabsContent>

            <TabsContent value="images" className="mt-4">
              {formSection('Imágenes del producto', (
                <>
                  <ImageUploader images={images} onChange={setImages} maxImages={8} />
                  <p className="text-xs text-zinc-400">
                    Hacé clic en ★ para establecer la imagen principal. Arrastrá para reordenar.
                  </p>
                </>
              ))}
            </TabsContent>

            <TabsContent value="seo" className="space-y-4 mt-4">
              {formSection('Optimización para buscadores (SEO)', (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Meta título</Label>
                    <Input {...register('seo_title')} placeholder="Título para Google..." className="text-sm" />
                    <p className="text-[10px] text-zinc-400">Ideal: 50–60 caracteres</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Meta descripción</Label>
                    <Textarea
                      {...register('seo_description')}
                      placeholder="Descripción que aparece en los resultados de búsqueda..."
                      rows={2}
                      className="resize-none text-sm"
                    />
                    <p className="text-[10px] text-zinc-400">Ideal: 150–160 caracteres</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Palabras clave</Label>
                    <TagInput
                      value={watch('seo_keywords')}
                      onChange={(val) => setValue('seo_keywords', val)}
                      placeholder="Ej: auriculares bluetooth"
                    />
                  </div>
                </>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Visibility options */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-4">Visibilidad y opciones</h3>
            <div className="space-y-3">
              {[
                { key: 'is_featured' as const, label: 'Producto destacado', color: 'text-amber-500' },
                { key: 'is_new' as const, label: 'Nuevo ingreso', color: 'text-sky-500' },
                { key: 'is_on_sale' as const, label: 'En oferta', color: 'text-orange-500' },
                { key: 'is_best_seller' as const, label: 'Más vendido', color: 'text-emerald-500' },
                { key: 'is_recommended' as const, label: 'Recomendado', color: 'text-violet-500' },
              ].map(({ key, label, color }) => (
                <div key={key} className="flex items-center justify-between py-1">
                  <Label className={`text-sm ${color} font-medium cursor-pointer`}>{label}</Label>
                  <Switch
                    checked={watch(key)}
                    onCheckedChange={(checked) => setValue(key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Preview card */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-3">Vista previa</h3>
            <div className="rounded-lg border border-zinc-100 dark:border-zinc-800 overflow-hidden">
              <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                {images[0]?.url ? (
                  <img src={images[0].url} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-zinc-400 text-xs">Sin imagen</span>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2">
                  {watch('name') || 'Nombre del producto'}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">
                  {watch('short_description') || 'Sin descripción'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    ${watch('price') || 0}
                  </span>
                  {(watch('promotional_price') ?? 0) > 0 && (
                    <span className="text-xs text-zinc-400 line-through">${watch('promotional_price')}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {watch('is_featured') && <Badge className="text-[9px] h-4 bg-amber-100 text-amber-700 border-0">Destacado</Badge>}
                  {watch('is_new') && <Badge className="text-[9px] h-4 bg-sky-100 text-sky-700 border-0">Nuevo</Badge>}
                  {watch('is_on_sale') && <Badge className="text-[9px] h-4 bg-orange-100 text-orange-700 border-0">Oferta</Badge>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
