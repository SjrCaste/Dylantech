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
        <h2 className="text-3xl font-bold text-foreground mb-2">Combos Emprendedores</h2>
        <p className="text-sm text-muted-foreground">Productos de alta rotación con excelente margen de ganancia</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
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
            <div className="p-3 sm:p-6 flex flex-col flex-grow">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm sm:text-lg font-bold text-foreground mb-1">{combo.name}</h3>
                  {combo.subtitle && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{combo.subtitle}</p>
                  )}
                </div>
                {combo.badge && (
                  <span className="ml-2 inline-block whitespace-nowrap rounded-lg bg-accent/20 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-accent border border-accent/20">
                    {combo.badge}
                  </span>
                )}
              </div>

              <div className="mb-4 space-y-2 border-t border-primary/10 pt-4">
                {combo.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
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

              <div className="mt-auto">
                <a
                  href={`https://wa.me/5491122813943?text=Hola%20Dylan%21%20Me%20interesa%20el%20*${encodeURIComponent(
                    combo.name
                  )}*%20por%20${formatPrice(combo.price, combo.currency)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-2 py-2 sm:px-4 sm:py-2.5 text-[11px] sm:text-sm font-bold text-white transition-all hover:bg-[#20bd5a] hover:shadow-md"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Consultar
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
