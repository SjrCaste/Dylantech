import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/product-form'

export const metadata = { title: 'Editar Producto' }

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()

  const [
    { data: product },
    { data: categories },
    { data: subcategories },
  ] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('subcategories').select('id, name, category_id').order('name'),
  ])

  if (!product) notFound()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ProductForm
        product={product}
        categories={categories ?? []}
        subcategories={subcategories ?? []}
      />
    </div>
  )
}
