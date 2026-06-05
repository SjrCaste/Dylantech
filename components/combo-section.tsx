"use client"

import Image from "next/image"
import { products } from "@/lib/products"

export function ComboSection() {
  const formatPrice = (price: number, currency: string) => {
    if (currency === "ARS") {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
      }).format(price)
    }
    return `$${price.toFixed(2)} USD`
  }

  return (
    <section id="combos" className="container-main">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">🔥 Combos Emprendedores</h2>
        <p className="text-sm text-muted-foreground">Productos de alta rotación con excelente margen de ganancia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.combos.map((combo) => (
          <div
            key={combo.id}
            className="group overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 transition-all duration-200 hover:border-primary/50 hover:shadow-lg"
          >
            {combo.image && (
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/90 border-b border-primary/10">
                <Image
                  src={combo.image}
                  alt={combo.name}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-102"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority
                />
              </div>
            )}
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">{combo.name}</h3>
                  {combo.subtitle && (
                    <p className="text-xs text-muted-foreground">{combo.subtitle}</p>
                  )}
                </div>
                {combo.badge && (
                  <span className="ml-2 inline-block whitespace-nowrap rounded-lg bg-accent/20 px-3 py-1 text-xs font-semibold text-accent border border-accent/20">
                    {combo.badge}
                  </span>
                )}
              </div>

              <div className="mb-4 space-y-2 border-t border-primary/10 pt-4">
                {combo.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.product}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mb-4 rounded-lg bg-primary/10 p-3">
                <div className="text-xs text-muted-foreground mb-1">PRECIO TOTAL</div>
                <div className="text-2xl font-bold text-primary">
                  {formatPrice(combo.price, combo.currency)}
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-4">
                ✓ Stock disponible para entrega inmediata
              </p>

              <a
                href={`https://wa.me/5491122813943?text=Hola%20Dylan%20Tech%21%20Me%20interesa%20el%20${encodeURIComponent(
                  combo.name
                )}%20por%20${formatPrice(combo.price, combo.currency)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 text-center transition-colors duration-200"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
