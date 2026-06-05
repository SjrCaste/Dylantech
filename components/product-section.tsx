"use client"

import { useState } from "react"
import Image from "next/image"
import type { Product } from "@/lib/products"

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const formatPrice = (price: number, currency: string) => {
    if (currency === "ARS") {
      return `$${price.toLocaleString("es-AR")}`
    }
    return `${price} USD`
  }

  const images = product.images || (product.image ? [product.image] : [])
  const currentImage = images[activeImageIndex] || product.image

  return (
    <div id={product.id} className="flex flex-col h-full group overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-200 hover:border-border scroll-mt-28">
      {currentImage && (
        <div className="relative h-44 w-full overflow-hidden bg-transparent">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setActiveImageIndex(idx)
                  }}
                  className={`h-2 w-2 rounded-full transition-all ${
                    idx === activeImageIndex 
                      ? "bg-primary w-4" 
                      : "bg-muted-foreground/60 hover:bg-muted-foreground"
                  }`}
                  aria-label={`Ir a imagen ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow mb-3">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground">
                {product.name}
              </h3>
              {product.subtitle && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {product.subtitle}
                </p>
              )}
            </div>
            {product.badge && (
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {product.badge}
              </span>
            )}
          </div>

          {product.hasWarranty && (
            <div className="mb-3 flex items-center gap-1 text-xs text-primary">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {product.hasWarranty}
            </div>
          )}
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div>
            <span className="text-2xl font-bold text-foreground">
              {formatPrice(product.basePrice, product.currency)}
            </span>
            {product.priceTiers && product.priceTiers.length > 0 && (
              <p className="text-xs text-muted-foreground">
                mejor precio x{product.priceTiers[product.priceTiers.length - 1].quantity}
              </p>
            )}
          </div>
          {!product.priceTiers && (
            <span className="text-xs text-muted-foreground">
              mín. x{product.minQuantity}
            </span>
          )}
        </div>

        {product.priceTiers && product.priceTiers.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-border/50 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary"
          >
            {isExpanded ? "Ocultar precios" : "Ver precios por cantidad"}
            <svg
              className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        {isExpanded && product.priceTiers && (
          <div className="mt-3 space-y-1.5 border-t border-border/50 pt-3">
            {product.priceTiers.map((tier, index) => (
              <div
                key={index}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                  tier.label 
                    ? "bg-primary/10 border border-primary/20" 
                    : index === product.priceTiers!.length - 1
                    ? "bg-secondary"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {tier.quantity} unidades
                  </span>
                  {tier.label && (
                    <span className="rounded bg-primary/20 px-1.5 py-0.5 text-xs font-medium text-primary">
                      {tier.label}
                    </span>
                  )}
                </div>
                <span className="font-semibold text-foreground">
                  {formatPrice(tier.price, tier.currency)}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">c/u</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
