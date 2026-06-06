export function HeroBanner() {
  const features = [
    { icon: "✦", text: "MÍNIMO X5 UNIDADES" },
    { icon: "📦", text: "ENVÍOS A TODO EL PAÍS" },
    { icon: "✓", text: "STOCK PERMANENTE" },
    { icon: "⚡", text: "ENTREGA INMEDIATA" },
  ]

  const paymentMethods = [
    { icon: "🏦", text: "TRANSFERENCIA" },
    { icon: "💵", text: "EFECTIVO" },
    { icon: "📱", text: "MERCADO PAGO" },
  ]

  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-card to-background px-4 py-6 sm:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-5 text-center">
          <h1 className="mb-1.5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            CATÁLOGO <span className="text-accent">2026</span>
          </h1>
          <p className="text-base font-semibold text-muted-foreground tracking-widest">
            LISTA MAYORISTA
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-2 rounded-xl border border-border/50 bg-card/50 px-3 py-3 text-center"
            >
              <span className="text-lg leading-none">{feature.icon}</span>
              <span className="text-[11px] sm:text-xs font-semibold text-foreground leading-tight">{feature.text}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {paymentMethods.map((method, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground"
            >
              <span className="text-base">{method.icon}</span>
              <span>{method.text}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col items-center gap-3 text-center">
          <span className="text-sm text-muted-foreground">Contacto Dylan Etchechuri</span>
          <div className="flex flex-col sm:flex-row items-center gap-3 text-sm">
            <span className="text-foreground font-semibold">@dylan_fernaa</span>
            <a href="#order-guide" className="rounded-full bg-primary/10 px-4 py-2 text-primary text-xs font-bold border border-primary/20 hover:bg-primary/20 active:bg-primary/30 transition-all min-h-[36px] flex items-center">
              ¿Dudas? Preguntas Frecuentes 👇
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
