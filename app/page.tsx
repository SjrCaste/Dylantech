import { createPublicClient } from '@/lib/supabase/public'
import { Header } from '@/components/header'
import { HeroBanner } from '@/components/hero-banner'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { OrderGuide } from '@/components/order-guide'
import { CatalogClient } from '@/components/catalog-client'
import type { Product, Category, Combo } from '@/lib/types/admin'

export const revalidate = 60

async function fetchCatalogData() {
  const supabase = createPublicClient()

  const [{ data: products }, { data: categories }, { data: combos }] = await Promise.all([
    supabase
      .from('products')
      .select('*, category:categories(id, name, slug, display_order)')
      .eq('status', 'available')
      .order('display_order'),
    supabase
      .from('categories')
      .select('*')
      .eq('is_visible', true)
      .order('display_order'),
    supabase
      .from('combos')
      .select('*, combo_products(quantity, product:products(id, name, price))')
      .eq('is_active', true)
      .order('display_order'),
  ])

  return {
    products: (products ?? []) as Product[],
    categories: (categories ?? []) as Category[],
    combos: (combos ?? []) as Combo[],
  }
}

export default async function CatalogPage() {
  const { products, categories, combos } = await fetchCatalogData()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner />
        <CatalogClient products={products} categories={categories} combos={combos} />
        <OrderGuide />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
