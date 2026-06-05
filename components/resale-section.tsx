"use client"

import { useState } from "react"
import Image from "next/image"
import { products } from "@/lib/products"

export function ResaleSection() {
  return (
    <section id="resale" className="scroll-mt-28 px-4 pt-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 border-b border-border/50 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              IPHONES DISPONIBLES
            </h2>
          </div>
          <p className="text-muted-foreground">
            Equipos seleccionados y con garantía.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

  const quantityOptions = product.priceTiers ? [
    { label: product.minQuantity === 1 ? 'x1 Unidad' : `x${product.minQuantity} Unidades`, highlight: product.minQuantity === 1 },
    ...product.priceTiers.filter(t => t.quantity !== product.minQuantity).map(t => ({
      label: `x${t.quantity} Unidades`, highlight: false
    }))
  ] : [
    { label: product.minQuantity === 1 ? 'x1 Unidad' : `x${product.minQuantity} Unidades`, highlight: true }
  ];

  const [selectedQuantity, setSelectedQuantity] = useState(quantityOptions[0].label)

  const generarMensajeWhatsApp = (cantidad: string) => {
    const texto = `Hola Dylan! Me interesa comprar *${product.name}* (${cantidad}). ¿Me pasás más info?`
    return `https://wa.me/5491122813943?text=${encodeURIComponent(texto)}`
  }

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

          {product.features && product.features.length > 0 && (
            <ul className="mb-4 space-y-1.5 border-t border-border/50 pt-3">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-[11px] sm:text-xs text-muted-foreground leading-tight">
                  <svg className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
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

        <div className="mt-4 pt-3 border-t border-border/50">
          {quantityOptions.length > 1 && (
            <div className="mb-2">
              <label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider font-semibold">Seleccionar cantidad:</label>
              <select
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(e.target.value)}
                className="w-full bg-secondary/50 border border-border/50 rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto' }}
              >
                {quantityOptions.map(opt => (
                  <option key={opt.label} value={opt.label}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
          <a
            href={generarMensajeWhatsApp(selectedQuantity)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#20bd5a] hover:shadow-md"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
