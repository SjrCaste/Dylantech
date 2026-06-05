"use client"

import { useState } from "react"

function AccordionItem({ title, icon, defaultOpen = false, children }: { title: string, icon: string, defaultOpen?: boolean, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={`rounded-xl border transition-all duration-300 overflow-hidden mb-4 ${isOpen ? 'border-primary/40 shadow-md shadow-primary/5' : 'border-border/50 hover:border-primary/20 bg-card'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-5 text-left transition-colors ${isOpen ? 'bg-primary/5' : 'hover:bg-primary/5'}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl md:text-2xl">{icon}</span>
          <h3 className="font-bold text-foreground uppercase tracking-wide text-sm sm:text-base">{title}</h3>
        </div>
        <span className={`text-primary transition-transform duration-300 flex-shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div 
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="p-5 pt-2 border-t border-border/50 bg-card/50">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export function OrderGuide() {
  return (
    <section id="order-guide" className="scroll-mt-28 px-4 py-12 md:py-20 bg-background border-t border-border/50">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mb-3 uppercase">
            Guía de Compra
          </h2>
          <p className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase flex justify-center items-center gap-2">
            Respuesta rápida y asesoramiento ⚡
          </p>
        </div>

        <div className="space-y-1">
          {/* Item 1: Cómo pedir */}
          <AccordionItem title="¿Cómo hacer un pedido?" icon="🛒" defaultOpen={true}>
            <div className="space-y-6 pt-2">
              <div>
                <h4 className="text-sm font-bold text-primary mb-2 uppercase">Paso 1:</h4>
                <p className="text-xs sm:text-sm text-foreground font-semibold uppercase leading-relaxed mb-3">
                  Mandanos tu pedido al privado<br/>
                  <span className="text-muted-foreground text-[10px] sm:text-xs">(Producto y cantidad de cada producto)</span>
                </p>
                <div className="rounded-lg bg-secondary/40 p-4 border border-border/50">
                  <span className="text-[10px] font-bold text-foreground block mb-1 uppercase tracking-wider">Ejemplo:</span>
                  <p className="text-[11px] sm:text-xs text-muted-foreground italic leading-relaxed uppercase">
                    "Hola Dylan, me interesan 5 AirPods y 5 Camisetas Arg, ¿cuánto quedaría el precio final? Soy de Buenos Aires / Capital, ¿puedo pasar a retirar o envío?"
                  </p>
                </div>
              </div>
              
              <div className="border-t border-border/50 pt-4">
                <h4 className="text-sm font-bold text-primary mb-2 uppercase">Paso 2:</h4>
                <p className="text-xs sm:text-sm text-foreground font-semibold uppercase leading-relaxed">
                  Te cotizamos el total, coordinamos la entrega y la forma de pago.
                </p>
              </div>
            </div>
          </AccordionItem>

          {/* Item 2: Retiros y Envíos */}
          <AccordionItem title="Envíos y Retiros" icon="📦">
            <div className="space-y-6 pt-2">
              <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
                <h4 className="font-bold text-foreground uppercase tracking-wide mb-2 text-sm flex items-center gap-2">
                  <span>🏪</span> Si es por retiro:
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground uppercase leading-relaxed">
                  Pagás en el momento de retiro en <span className="font-bold text-foreground">Efectivo / Transferencia / Dólares</span>.
                  <br/>
                  <span className="block mt-2 text-[10px] font-bold text-primary">Punto de encuentro según zona 📍</span>
                </p>
              </div>
              
              <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
                <h4 className="font-bold text-foreground uppercase tracking-wide mb-2 text-sm flex items-center gap-2">
                  <span>🚚</span> Si es por envío:
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground uppercase leading-relaxed">
                  Pagás al confirmar el pedido en <span className="font-bold text-foreground">Transferencia / USDT</span>.<br/>
                  <span className="font-bold text-foreground block mt-2">Despachamos el mismo día que se realizó el pago.</span>
                </p>
                <p className="mt-3 text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wide border-t border-primary/20 pt-3">
                  Vía Cargo / Andreani / Correo Argentino (Todo el país) 🇦🇷
                </p>
              </div>
            </div>
          </AccordionItem>

          {/* Item 3: Pagos y Precios */}
          <AccordionItem title="Pagos y Cotización" icon="💳">
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div className="rounded-lg bg-secondary/30 p-4 border border-border/50">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-3">Medios de Pago</h4>
                <p className="text-[11px] sm:text-xs text-muted-foreground font-semibold uppercase leading-relaxed">
                  Efectivo / Transferencia / USD / USDT
                </p>
                <div className="mt-4 pt-3 border-t border-border/50">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wide leading-relaxed">
                    Cotización al "Dólar Blue Venta" al momento del pago en "ARS" 💵
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-secondary/30 p-4 border border-border/50">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-3">Precios</h4>
                <p className="text-[11px] sm:text-xs text-muted-foreground uppercase font-semibold mb-2">
                  <span className="font-bold text-foreground">Minorista:</span> Precio en pesos (ARS)
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground uppercase font-semibold">
                  <span className="font-bold text-foreground">Mayorista:</span> Precio en USD
                </p>
                <div className="mt-4 pt-3 border-t border-border/50">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wide">
                    A partir de 5 unidades se aplica precio mayorista
                  </p>
                </div>
              </div>
            </div>
          </AccordionItem>

          {/* Item 4: FAQ */}
          <AccordionItem title="Preguntas Frecuentes" icon="❓">
            <div className="pt-2">
              <h4 className="font-bold text-foreground uppercase tracking-wide mb-5 text-sm">
                "¿Cómo puedo confiar si es por envío?"
              </h4>
              <ul className="space-y-5 text-xs sm:text-sm text-muted-foreground uppercase font-medium">
                <li className="flex gap-3 items-start">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary font-bold flex-shrink-0 mt-0.5">1</span>
                  <span className="leading-relaxed">Hacemos videollamada en tiempo real con tu pedido.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary font-bold flex-shrink-0 mt-0.5">2</span>
                  <span className="leading-relaxed">Te paso mi Instagram, donde tengo muchas referencias de mi trabajo.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary font-bold flex-shrink-0 mt-0.5">3</span>
                  <span className="leading-relaxed">A la hora del despacho, te envío seguimiento de tu pedido.</span>
                </li>
              </ul>
            </div>
          </AccordionItem>
        </div>
      </div>
    </section>
  )
}

