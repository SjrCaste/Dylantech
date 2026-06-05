"use client"

export function OrderGuide() {
  return (
    <section id="order-guide" className="scroll-mt-28 px-4 py-16 bg-background border-t border-border/50">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mb-2 uppercase">
            ¿Cómo hacer un pedido?
          </h2>
          <p className="text-sm font-bold text-primary tracking-widest uppercase flex justify-center items-center gap-2">
            Con respuesta rápida ⚡
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Paso 1 */}
          <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
            <h3 className="text-lg font-bold text-primary mb-3 uppercase">Paso 1:</h3>
            <p className="text-xs sm:text-sm text-foreground mb-4 font-semibold uppercase leading-relaxed">
              Mandanos tu pedido al privado<br/>
              <span className="text-muted-foreground">(Producto y cantidad de cada producto)</span>
            </p>
            <div className="rounded-lg bg-secondary/30 p-4 border border-border/50">
              <span className="text-[10px] font-bold text-foreground block mb-2 uppercase tracking-wider">Ejemplo:</span>
              <p className="text-xs text-muted-foreground italic leading-relaxed uppercase">
                "Hola Dylan, me interesan 5 AirPods y 5 Camisetas Arg, ¿cuánto quedaría el precio final? Soy de Buenos Aires / Capital, ¿puedo pasar a retirar o envío?"
              </p>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm flex flex-col justify-center text-center md:text-left">
            <h3 className="text-lg font-bold text-primary mb-3 uppercase">Paso 2:</h3>
            <p className="text-xs sm:text-sm text-foreground font-semibold uppercase leading-relaxed">
              Te cotizamos el total, coordinamos la entrega y forma de pago.
            </p>
          </div>
        </div>

        {/* Datos Importantes */}
        <div className="mb-12 rounded-xl border border-primary/20 bg-gradient-to-br from-card to-primary/5 p-6 md:p-8">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-primary uppercase tracking-wide">Datos Importantes</h3>
            <span className="text-xl md:text-2xl">👇</span>
          </div>
          
          <div className="space-y-8">
            <div>
              <h4 className="font-bold text-foreground uppercase tracking-wide mb-2">Si es por retiro:</h4>
              <p className="text-xs md:text-sm text-muted-foreground uppercase leading-relaxed">
                Pagás en el momento de retiro en Efectivo / Transferencia / Dólares.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-foreground uppercase tracking-wide mb-2">Si es por envío:</h4>
              <p className="text-xs md:text-sm text-muted-foreground uppercase leading-relaxed">
                Pagás al confirmar el pedido en Transferencia / USDT.<br/>
                <span className="font-semibold text-foreground">Despachamos el mismo día que se realizó el pago.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Políticas de Precio y Envío (Image 1) */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="rounded-xl border border-border/50 bg-card p-6 text-center flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-foreground uppercase tracking-widest mb-4">Medios de Pago</h4>
              <p className="text-xs text-muted-foreground font-medium uppercase leading-relaxed">
                Efectivo / Transferencia / USD / USDT
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/50">
              <p className="text-[10px] md:text-xs font-bold text-foreground uppercase tracking-wide flex items-center justify-center gap-1">
                Cotización al "Dólar Blue Venta" al momento del pago en "ARS" 💵
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-card p-6 text-center flex flex-col justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium mb-3">
                <span className="font-bold text-foreground">Minorista:</span> Precio en pesos (ARS)
              </p>
              <p className="text-xs text-muted-foreground uppercase font-medium">
                <span className="font-bold text-foreground">Mayorista:</span> Precio en USD
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/50">
              <p className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-wide">
                A partir de 5 unidades se aplica precio mayorista
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12 rounded-xl border border-border/50 bg-card p-8 text-center">
          <h4 className="text-sm font-bold text-foreground uppercase tracking-widest mb-6">Métodos de Envío / Entrega</h4>
          <div className="space-y-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center justify-center gap-2">
              Punto de encuentro según zona 📍
            </p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex flex-col sm:flex-row items-center justify-center gap-2">
              Vía Cargo / Andreani / Correo Argentino
              <span className="font-bold text-foreground flex items-center gap-1">
                (Todo el país) 🇦🇷
              </span>
            </p>
          </div>
        </div>

        {/* Preguntas Frecuentes */}
        <div className="rounded-xl border border-primary/20 bg-card p-6 md:p-10 shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-8 border-b border-primary/20 pb-6">
            <h3 className="text-xl md:text-2xl font-bold text-primary uppercase tracking-wide">Preguntas Frecuentes</h3>
            <span className="text-xl md:text-2xl">👇</span>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <h4 className="font-bold text-foreground text-center uppercase tracking-wide mb-8 text-sm md:text-base">
              "¿Cómo puedo confiar si es por envío?"
            </h4>
            <ul className="space-y-6 text-xs md:text-sm text-muted-foreground uppercase font-medium">
              <li className="flex gap-4 items-start">
                <span className="font-extrabold text-primary text-base">1-</span>
                <span className="pt-0.5 leading-relaxed">Hacemos videollamada en tiempo real con tu pedido.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="font-extrabold text-primary text-base">2-</span>
                <span className="pt-0.5 leading-relaxed">Te paso mi Instagram, donde tengo muchas referencias de mi trabajo.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="font-extrabold text-primary text-base">3-</span>
                <span className="pt-0.5 leading-relaxed">A la hora del despacho, te envío seguimiento de tu pedido.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

