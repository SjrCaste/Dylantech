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

        <div className="mt-6">
          <a
            href="#order-guide"
            className="inline-flex items-center gap-2 rounded-full border border-border/30 bg-card/40 px-5 py-2 text-[11px] sm:text-xs font-semibold tracking-widest text-muted-foreground/70 uppercase transition-all hover:border-primary/40 hover:text-primary active:scale-95"
          >
            <span>❓</span>
            Preguntas Frecuentes
            <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
