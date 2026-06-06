'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/lib/types/admin'

interface ProductSectionProps {
  id: string
  title: string
  products: Product[]
}

export function ProductSection({ id, title, products }: ProductSectionProps) {
  return (
    <section id={id} className="scroll-mt-28 px-4 pt-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-xl font-bold uppercase tracking-wide text-foreground">
          {title}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  const images = product.images ?? []
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    return a.order - b.order
  })
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const currentImage = sortedImages[activeImageIndex]

  const formatPrice = (price: number) =>
    `$${price.toLocaleString('es-AR')}`

  const badge = product.is_on_sale
    ? 'OFERTA'
    : product.is_new
    ? 'NUEVO'
    : product.is_featured
    ? 'DESTACADO'
    : null

  const waMessage = encodeURIComponent(
    `Hola Dylan! Me interesa *${product.name}* a ${formatPrice(product.price)}. ¿Me pasás más info?`
  )

  return (
    <div
      id={product.slug}
      className="flex flex-col h-full group overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-200 hover:border-border scroll-mt-28"
    >
      {currentImage ? (
        <div className="relative aspect-square w-full overflow-hidden bg-transparent">
          <Image
            src={currentImage.url}
            alt={currentImage.alt || product.name}
            fill
            className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {sortedImages.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
              {sortedImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setActiveImageIndex(idx)
                  }}
                  className={`h-2 rounded-full transition-all ${
                    idx === activeImageIndex
                      ? 'bg-primary w-4'
                      : 'bg-muted-foreground/60 w-2 hover:bg-muted-foreground'
                  }`}
                  aria-label={`Imagen ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}

      <div className="p-2.5 sm:p-4 flex flex-col flex-grow">
        <div className="flex-grow mb-3">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-semibold text-foreground leading-tight">
                {product.name}
              </h3>
              {product.short_description && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {product.short_description}
                </p>
              )}
            </div>
            {badge && (
              <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent border border-accent/20 whitespace-nowrap">
                {badge}
              </span>
            )}
          </div>

          {product.features && product.features.length > 0 && (
            <ul className="mb-4 space-y-1.5 border-t border-border/50 pt-3">
              {product.features.slice(0, 3).map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-1.5 text-xs text-muted-foreground leading-tight"
                >
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="text-lg sm:text-2xl font-bold text-foreground">
                {formatPrice(product.promotional_price && product.promotional_price > 0 ? product.promotional_price : product.price)}
              </span>
              {product.promotional_price && product.promotional_price > 0 && (
                <p className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-border/50">
            <a
              href={`https://wa.me/5491122813943?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#20bd5a] active:bg-[#1aad50] hover:shadow-md min-h-[44px]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Pedir por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
