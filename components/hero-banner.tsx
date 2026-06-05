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
    <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-card to-background px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            CATÁLOGO <span className="text-accent">2026</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            LISTA MAYORISTA
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-center"
            >
              <span className="text-base">{feature.icon}</span>
              <span className="text-xs font-medium text-foreground">{feature.text}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {paymentMethods.map((method, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <span>{method.icon}</span>
              <span>{method.text}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <span className="text-sm text-muted-foreground">Contacto Dylan Etchechuri</span>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-foreground">@dylan_fernaa</span>
          </div>
        </div>
      </div>
    </section>
  )
}
