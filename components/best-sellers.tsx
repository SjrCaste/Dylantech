'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types/admin'

interface BestSellersProps {
  products: Product[]
}

export function BestSellers({ products }: BestSellersProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (products.length === 0) return null

  return (
    <section className="border-b border-border/50 bg-card/30 px-4 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
            Más Vendidos
          </h2>
        </div>

        <div
          className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide scroll-smooth px-0.5"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {products.map((item) => {
            const primaryImage =
              item.images?.find((img) => img.is_primary) ?? item.images?.[0]
            const formatPrice = (p: number) => `$${p.toLocaleString('es-AR')}`

            return (
              <Link
                key={item.id}
                href={`#${item.slug}`}
                style={{ scrollSnapAlign: 'start' }}
                className={`flex min-w-[120px] flex-col items-center gap-2 rounded-xl border border-border/50 bg-card p-3 transition-all duration-200 active:scale-95 ${
                  hoveredId === item.id
                    ? 'border-accent/50 bg-accent/5'
                    : 'hover:border-border'
                }`}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-secondary/40">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.alt || item.name}
                      fill
                      className="object-contain p-0.5"
                      sizes="56px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      —
                    </div>
                  )}
                </div>
                <span className="text-center text-[11px] font-semibold text-foreground leading-tight">
                  {item.name}
                </span>
                <span className="text-base font-bold text-accent">
                  {formatPrice(item.promotional_price && item.promotional_price > 0 ? item.promotional_price : item.price)}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
