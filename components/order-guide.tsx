"use client"

export function OrderGuide() {
  return (
    <section id="order-guide" className="scroll-mt-28 px-4 pt-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            ¿Cómo realizar tu pedido? ⚡
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Respuesta rápida y asesoramiento personalizado para revendedores y mayoristas
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1: Cómo pedir */}
          <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                Pasos para comprar
              </h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li>
                  <span className="font-semibold text-foreground block mb-1">Paso 1: Pedido</span>
                  Envíanos al privado el producto y la cantidad que necesitás.
                </li>
                <li>
                  <span className="font-semibold text-foreground block mb-1">Paso 2: Cotización</span>
                  Te cotizamos el total, coordinamos la entrega y definimos la forma de pago.
                </li>
              </ul>
            </div>
            
            <div className="mt-6 rounded-lg bg-secondary/30 p-3 border border-border/50">
              <span className="text-xs font-semibold text-foreground block mb-1">Ejemplo de mensaje:</span>
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                "Hola Dylan, me interesan 5 AirPods y 5 Camisetas Arg, ¿cuánto quedaría el precio final? Soy de CABA, ¿puedo retirar o hacen envíos?"
              </p>
            </div>
          </div>

          {/* Card 2: Formas de Pago */}
          <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                Entrega & Pago
              </h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li>
                  <span className="font-semibold text-foreground block mb-1">Con Retiro</span>
                  Pagás en el momento de retirar. Aceptamos **Efectivo**, **Transferencia** y **Dólares**.
                </li>
                <li>
                  <span className="font-semibold text-foreground block mb-1">Con Envío</span>
                  Pagás al confirmar tu pedido mediante **Transferencia** o **USDT**. Despachamos el mismo día que se acredita el pago.
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: Preguntas Frecuentes */}
          <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                ¿Es seguro comprar con envío?
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Entendemos tus dudas, por eso garantizamos total transparencia:
              </p>
              <ol className="space-y-3 text-sm text-muted-foreground list-decimal pl-4">
                <li>
                  <span className="font-semibold text-foreground">Videollamada en vivo:</span> Realizamos una videollamada para mostrarte tu pedido preparado antes de enviarlo.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Referencias reales:</span> Te compartimos nuestro Instagram con gran cantidad de referencias y entregas exitosas.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Seguimiento constante:</span> Te enviamos el comprobante y código de seguimiento ni bien despachamos tu paquete.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
