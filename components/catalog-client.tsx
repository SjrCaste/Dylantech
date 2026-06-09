'use client'

import { useState } from 'react'
import { BestSellers } from '@/components/best-sellers'
import { CategoryNav } from '@/components/category-nav'
import { ProductSection } from '@/components/product-section'
import { ComboSection } from '@/components/combo-section'
import { WholesaleSection } from '@/components/wholesale-section'
import type { Product, Category, Combo } from '@/lib/types/admin'

interface CatalogClientProps {
  products: Product[]
  categories: Category[]
  combos: Combo[]
}

export function CatalogClient({ products, categories, combos }: CatalogClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const bestSellers = products.filter((p) => p.is_best_seller)

  const navCategories = [
    ...categories.map((cat) => ({ id: cat.slug, label: cat.name })),
    ...(combos.length > 0 ? [{ id: 'combos', label: 'Combos' }] : []),
  ]

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId)
    const element = document.getElementById(categoryId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      {bestSellers.length > 0 && <BestSellers products={bestSellers} />}
      <CategoryNav
        categories={navCategories}
        activeCategory={activeCategory}
        onCategoryClick={scrollToCategory}
      />

      <div className="space-y-8 pb-32">
        <WholesaleSection />

        {categories.map((cat) => {
          const catProducts = products.filter((p) => p.category_id === cat.id)
          if (catProducts.length === 0) return null
          return (
            <ProductSection
              key={cat.id}
              id={cat.slug}
              title={cat.name}
              products={catProducts}
            />
          )
        })}

        {combos.length > 0 && (
          <ComboSection combos={combos} />
        )}
      </div>
    </>
  )
}
