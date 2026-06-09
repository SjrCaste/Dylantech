'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types/admin'
import { getFirstBulkTier, formatBulkPrice } from '@/lib/price-tiers-map'

interface BestSellersProps {
  products: Product[]
}

export function BestSellers({ products }: BestSellersProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (products.length === 0) return null

  return (
    <section className="border-b border-border/50 bg-gradient-to-b from-card/60 to-card/20 px-4 py-7">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center gap-2.5">
          <span className="text-2xl" style={{ display: 'inline-block', animation: 'fireFlicker 1.4s ease-in-out infinite' }}>🔥</span>
          <h2 className="text-lg font-extrabold uppercase tracking-wider text-accent">
            Productos en Tendencia
          </h2>
        </div>

        <div
          className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide scroll-smooth px-0.5 overscroll-x-contain"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {products.map((item) => {
            const primaryImage =
              item.images?.find((img) => img.is_primary) ?? item.images?.[0]
            const bulkTier = getFirstBulkTier(item.slug)
            const retailPrice = item.promotional_price && item.promotional_price > 0
              ? item.promotional_price
              : item.price

            return (
              <Link
                key={item.id}
                href={`#${item.slug}`}
                style={{ scrollSnapAlign: 'start' }}
                className={`flex min-w-[150px] flex-col items-center gap-2.5 rounded-2xl border bg-card p-4 transition-all duration-200 active:scale-95 ${
                  hoveredId === item.id
                    ? 'border-accent/60 bg-accent/5 shadow-md shadow-accent/10'
                    : 'border-border/60 hover:border-accent/30'
                }`}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-secondary/40">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.alt || item.name}
                      fill
                      className="object-contain p-1"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      —
                    </div>
                  )}
                </div>
                <span className="text-center text-xs font-semibold text-foreground leading-tight max-w-[130px]">
                  {item.name}
                </span>

                {bulkTier ? (
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-base font-extrabold text-accent">
                      {formatBulkPrice(bulkTier.price, bulkTier.currency)}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      c/u ×{bulkTier.quantity}
                    </span>
                  </div>
                ) : (
                  <span className="text-base font-extrabold text-accent">
                    ${retailPrice.toLocaleString('es-AR')}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
