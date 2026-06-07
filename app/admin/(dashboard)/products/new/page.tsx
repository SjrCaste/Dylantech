import { createServerClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/product-form'

export const metadata = { title: 'Nuevo Producto' }

async function getFormData() {
  const supabase = await createServerClient()
  const [{ data: categories }, { data: subcategories }] = await Promise.all([
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('subcategories').select('id, name, category_id').order('name'),
  ])
  return { categories: categories ?? [], subcategories: subcategories ?? [] }
}

export default async function NewProductPage() {
  const { categories, subcategories } = await getFormData()

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      <ProductForm categories={categories} subcategories={subcategories} />
    </div>
  )
}
