export function HeroBanner() {
  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-card to-background px-4 py-10 sm:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl text-center">
        <p className="mb-3 text-[9px] sm:text-[10px] font-bold tracking-[0.4em] text-muted-foreground/50 uppercase">
          ◆ Catálogo Oficial ◆
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          PRODUCTOS{' '}
          <span className="text-accent">DISPONIBLES</span>
          {' '}2026
        </h1>
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-accent/40" />
          <span className="text-[11px] sm:text-xs font-bold tracking-[0.35em] text-muted-foreground uppercase">
            Precios Preferenciales
          </span>
          <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-accent/40" />
        </div>
      </div>
    </section>
  )
}
