"use client"

import { useState } from "react"
import Image from "next/image"
import { products } from "@/lib/products"

export function ResaleSection() {
  return (
    <section id="resale" className="scroll-mt-28 px-4 pt-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg">📲</span>
            <h2 className="text-lg font-bold text-foreground">
              LISTA REVENTAS — GRADO A / -A
            </h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            💰 Precios para revendedores. Podés subirle entre 20 y 30 USD por unidad y seguir siendo competitivo.
          </p>
          
          <div className="space-y-2 text-xs text-muted-foreground">
            <p className="flex items-start gap-2">
              <span>📸</span>
              <span>Foto del IMEI al recibir — confirmás que el equipo llegó en condiciones.</span>
            </p>
            <p className="flex items-start gap-2">
              <span>🚫</span>
              <span>Garantía no cubre roturas de pantalla ni daño por agua.</span>
            </p>
            <p className="flex items-start gap-2">
              <span>🔧</span>
              <span>Ante cualquier falla, el equipo pasa por revisión con técnico especializado.</span>
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.resale.map((product) => (
            <ResaleCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface ResaleProduct {
  id: string
  name: string
  subtitle?: string
  basePrice: number
  currency: "USD" | "ARS"
  minQuantity: number
  badge?: string
  hasWarranty?: string
  image?: string
  priceTiers?: {
    quantity: number
    price: number
    currency: "USD" | "ARS"
    label?: string
  }[]
}

function ResaleCard({ product }: { product: ResaleProduct }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatPrice = (price: number, currency: string) => {
    if (currency === "ARS") {
      return `$${price.toLocaleString("es-AR")}`
    }
    return `${price} USD`
  }

  return (
    <div id={product.id} className="flex flex-col h-full group overflow-hidden rounded-xl border border-primary/30 bg-card transition-all duration-200 hover:border-primary/50 scroll-mt-28">
      {product.image && (
        <div className="relative h-44 w-full overflow-hidden bg-transparent">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow mb-3">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  {product.name}
                </h3>
                {product.badge && (
                  <span className="text-lg">{product.badge}</span>
                )}
              </div>
              {product.subtitle && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {product.subtitle}
                </p>
              )}
            </div>
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
            className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-primary/30 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
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
                    {tier.quantity} {tier.quantity === 1 ? "unidad" : "unidades"}
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
