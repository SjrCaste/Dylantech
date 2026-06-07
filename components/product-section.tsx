'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/lib/types/admin'
import { getBulkTiers, formatBulkPrice, type BulkTier } from '@/lib/price-tiers-map'

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

type QtyOption = '5' | '10' | '20' | 'mas' | ''

const WA_NUMBER = '5491122813943'

const CHEVRON_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371717a' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")"

function ProductCard({ product }: { product: Product }) {
  const images = product.images ?? []
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    return a.order - b.order
  })
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedQty, setSelectedQty] = useState<QtyOption>('')
  const currentImage = sortedImages[activeImageIndex]

  const tiers = getBulkTiers(product.slug)
  const isConsultOnly = !product.price || product.price <= 0

  const retailPrice =
    product.promotional_price && product.promotional_price > 0
      ? product.promotional_price
      : product.price

  // Highest applicable tier for a given qty (e.g. qty=10 → uses tier qty≤10)
  const getApplicableTier = (qty: number): BulkTier | null => {
    const applicable = tiers.filter((t) => t.quantity <= qty)
    if (!applicable.length) return null
    return applicable.sort((a, b) => b.quantity - a.quantity)[0]
  }

  const numericQty = selectedQty !== '' && selectedQty !== 'mas' ? parseInt(selectedQty) : null
  const currentTier = numericQty ? getApplicableTier(numericQty) : null

  const badge = product.is_on_sale
    ? 'OFERTA'
    : product.is_new
    ? 'NUEVO'
    : product.is_featured
    ? 'DESTACADO'
    : null

  // Label for each dropdown option
  const optionLabel = (qty: number) => {
    const tier = getApplicableTier(qty)
    return tier
      ? `×${qty} unidades — ${formatBulkPrice(tier.price, tier.currency)} c/u`
      : `×${qty} unidades — Consultar precio`
  }

  // Price block shown on the card
  const priceBlock = (() => {
    if (isConsultOnly) {
      return { main: 'Consultar precio', sub: null }
    }
    if (!selectedQty) {
      return { main: `$${retailPrice.toLocaleString('es-AR')}`, sub: 'Precio por unidad' }
    }
    if (selectedQty === 'mas') {
      return { main: 'Consultar precio', sub: 'Más de 20 unidades' }
    }
    if (currentTier) {
      const total = currentTier.price * numericQty!
      return {
        main: `${formatBulkPrice(currentTier.price, currentTier.currency)} c/u`,
        sub: `Total ×${selectedQty}: ${formatBulkPrice(total, currentTier.currency)}`,
      }
    }
    return { main: 'Consultar precio', sub: `×${selectedQty} unidades` }
  })()

  // WhatsApp message
  const waMessage = (() => {
    if (isConsultOnly) {
      return encodeURIComponent(
        `Hola, me interesa *${product.name}*. ¿Me podés dar más información?`
      )
    }
    if (!selectedQty) {
      return encodeURIComponent(
        `Hola Dylan! Me interesa *${product.name}* a $${retailPrice.toLocaleString('es-AR')} ARS. ¿Me pasás más info?`
      )
    }
    if (selectedQty === 'mas') {
      return encodeURIComponent(
        `Hola, me interesa comprar más de 20 unidades del producto *${product.name}*. ¿Me podrían dar un presupuesto?`
      )
    }
    if (currentTier) {
      const total = currentTier.price * numericQty!
      return encodeURIComponent(
        `Hola Dylan! Quiero *×${selectedQty} ${product.name}* a ${formatBulkPrice(currentTier.price, currentTier.currency)} c/u. Total: ${formatBulkPrice(total, currentTier.currency)}. ¿Confirmás disponibilidad?`
      )
    }
    return encodeURIComponent(
      `Hola, me interesa comprar *×${selectedQty} ${product.name}*. ¿Me podrían dar un presupuesto?`
    )
  })()

  const waButtonText = isConsultOnly
    ? 'Consultar por WhatsApp'
    : !selectedQty
    ? 'Pedir por WhatsApp'
    : selectedQty === 'mas'
    ? 'Consultar precio por WA'
    : `Pedir ×${selectedQty} por WhatsApp`

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
        {/* Name + badge */}
        <div className="flex-grow mb-3">
          <div className="mb-2 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-semibold text-foreground leading-tight">
                {product.name}
              </h3>
              {product.short_description && (
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                  {product.short_description}
                </p>
              )}
            </div>
            {badge && (
              <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent border border-accent/20 whitespace-nowrap">
                {badge}
              </span>
            )}
          </div>

          {product.features && product.features.length > 0 && (
            <ul className="mb-2 space-y-1 border-t border-border/50 pt-2">
              {product.features.slice(0, 2).map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-1.5 text-xs text-muted-foreground leading-tight"
                >
                  <svg
                    className="h-3 w-3 shrink-0 text-primary mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-auto space-y-2.5">
          {/* Price display */}
          <div>
            <span
              className={`text-lg sm:text-2xl font-bold ${
                priceBlock.main === 'Consultar precio'
                  ? 'text-muted-foreground text-base sm:text-lg'
                  : 'text-foreground'
              }`}
            >
              {priceBlock.main}
            </span>
            {priceBlock.sub && (
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                {priceBlock.sub}
              </p>
            )}
            {!selectedQty &&
              product.promotional_price &&
              product.promotional_price > 0 && (
                <p className="text-xs text-muted-foreground line-through">
                  ${product.price.toLocaleString('es-AR')}
                </p>
              )}
          </div>

          {/* Quantity dropdown */}
          {!isConsultOnly && (
            <div>
              <label className="block text-[9px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                Comprá en cantidad
              </label>
              <select
                value={selectedQty}
                onChange={(e) => setSelectedQty(e.target.value as QtyOption)}
                className="w-full rounded-lg border border-border/60 bg-secondary/50 text-foreground text-xs sm:text-sm px-3 py-2 cursor-pointer focus:outline-none focus:border-accent/70 transition-colors appearance-none pr-8"
                style={{
                  backgroundImage: CHEVRON_SVG,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '14px',
                }}
              >
                <option value="">Seleccioná cantidad...</option>
                <option value="5">{optionLabel(5)}</option>
                <option value="10">{optionLabel(10)}</option>
                <option value="20">{optionLabel(20)}</option>
                <option value="mas">Más de 20 → Consultar por WhatsApp</option>
              </select>
            </div>
          )}

          {/* WhatsApp button */}
          <div className="pt-1 border-t border-border/50">
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#20bd5a] active:bg-[#1aad50] hover:shadow-md min-h-[44px]"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              {waButtonText}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
