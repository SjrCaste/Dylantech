"use client"

export function WholesaleSection() {
  return (
    <section id="wholesale" className="scroll-mt-28 px-4 pt-12 pb-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-background to-accent/5 shadow-lg">
          <div className="p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-accent/20 px-4 py-1.5 mb-6">
              <span className="text-xl mr-2">🔥</span>
              <span className="text-sm font-bold text-accent tracking-wider uppercase">Descuentos Mayoristas</span>
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mb-4">
              PRECIOS ESPECIALES POR CANTIDAD
            </h2>
            
            <p className="max-w-2xl mx-auto text-muted-foreground mb-10 text-lg">
              Mejorá tu margen de ganancia comprando por volumen. ¡Aprovechá nuestra escala de precios!
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
              <div className="flex flex-col items-center p-6 bg-card rounded-xl border border-border/50 shadow-sm transition-all hover:border-accent/50">
                <div className="mb-4 text-3xl">✅</div>
                <h3 className="text-lg font-bold text-foreground mb-2">3 a 5 unidades</h3>
                <span className="mt-auto inline-block rounded-lg bg-secondary px-4 py-2 text-sm font-bold text-foreground">
                  Precio Básico
                </span>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-card rounded-xl border border-border/50 shadow-sm transition-all hover:border-accent/50">
                <div className="mb-4 text-3xl">✅</div>
                <h3 className="text-lg font-bold text-foreground mb-2">6 a 10 unidades</h3>
                <span className="mt-auto inline-block rounded-lg bg-secondary px-4 py-2 text-sm font-bold text-foreground">
                  Precio Medio
                </span>
              </div>

              <div className="flex flex-col items-center p-6 bg-card rounded-xl border border-border/50 shadow-sm transition-all hover:border-accent/50">
                <div className="mb-4 text-3xl">✅</div>
                <h3 className="text-lg font-bold text-foreground mb-2">11 a 20 unidades</h3>
                <span className="mt-auto inline-block rounded-lg bg-secondary px-4 py-2 text-sm font-bold text-foreground">
                  Precio Top
                </span>
              </div>

              <div className="flex flex-col items-center p-6 bg-card rounded-xl border border-accent/50 shadow-md bg-accent/5 transition-all hover:border-accent">
                <div className="mb-4 text-3xl">🚀</div>
                <h3 className="text-lg font-bold text-foreground mb-2">Más de 20 unidades</h3>
                <span className="mt-auto inline-block rounded-lg bg-accent text-accent-foreground px-4 py-2 text-sm font-bold">
                  Consultar Cotización
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
