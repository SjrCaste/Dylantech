import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground">
            Precios válidos sujetos a stock disponible.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pedidos únicamente por WhatsApp. Consultá disponibilidad antes de confirmar.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Link
            href="https://wa.me/5491122813943?text=Hola!%20Quiero%20consultar%20por%20el%20catálogo%20mayorista"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            CONSULTAR AHORA
          </Link>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
            <Link
              href="https://instagram.com/dylan_fernaa"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              @dylan_fernaa
            </Link>
            <span className="hidden sm:inline">·</span>
            <Link
              href="https://wa.me/5491122813943"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              +54 9 11 2281 3943
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground/60">
          © <span className="text-accent">2026</span> @dylan_fernaa · Lista Mayorista
        </div>
      </div>
    </footer>
  )
}
