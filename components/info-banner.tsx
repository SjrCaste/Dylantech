export function InfoBanner() {
  const features = [
    { icon: "✦", text: "MÍNIMO X5 UNIDADES", accent: true },
    { icon: "📦", text: "ENVÍOS A TODO EL PAÍS", accent: false },
    { icon: "✓", text: "STOCK PERMANENTE", accent: true },
    { icon: "⚡", text: "ENTREGA INMEDIATA", accent: false },
  ]

  return (
    <section className="px-4 py-5 border-y border-border/20 bg-card/10">
      <div className="mx-auto max-w-7xl space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="hidden sm:block text-border/60 text-xs mr-3">·</span>}
              <span className={`text-sm leading-none ${f.accent ? 'text-accent' : 'text-muted-foreground'}`}>{f.icon}</span>
              <span className="text-[11px] font-semibold tracking-wide text-muted-foreground">{f.text}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[10px] text-muted-foreground/60 font-medium">
          <span>🏦 TRANSFERENCIA</span>
          <span className="text-border/50">·</span>
          <span>💵 EFECTIVO</span>
          <span className="text-border/50">·</span>
          <span>📱 MERCADO PAGO</span>
          <span className="text-border/50 hidden sm:inline">·</span>
          <a href="https://instagram.com/dylan_fernaa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
            @dylan_fernaa
          </a>
          <span className="text-border/50">·</span>
          <a href="#order-guide" className="text-primary/60 hover:text-primary transition-colors font-semibold">
            Preguntas Frecuentes 👇
          </a>
        </div>
      </div>
    </section>
  )
}
