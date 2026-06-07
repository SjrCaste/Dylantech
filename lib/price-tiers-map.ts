export type Currency = 'USD' | 'ARS'

export interface BulkTier {
  quantity: number
  price: number
  currency: Currency
}

// Matched against product.slug.toLowerCase() using .includes()
const PATTERNS: Array<{ match: string[]; tiers: BulkTier[] }> = [
  {
    match: ['airpods-pro', 'airpods pro'],
    tiers: [
      { quantity: 5, price: 9.5, currency: 'USD' },
      { quantity: 10, price: 8.5, currency: 'USD' },
      { quantity: 20, price: 7.5, currency: 'USD' },
    ],
  },
  {
    match: ['airpods-max', 'airpods max'],
    tiers: [
      { quantity: 5, price: 15, currency: 'USD' },
      { quantity: 10, price: 15, currency: 'USD' },
      { quantity: 20, price: 15, currency: 'USD' },
    ],
  },
  {
    match: ['battery', 'magsafe', 'bateria'],
    tiers: [
      { quantity: 5, price: 11, currency: 'USD' },
      { quantity: 10, price: 10, currency: 'USD' },
      { quantity: 20, price: 9, currency: 'USD' },
    ],
  },
  {
    match: ['combo-cargador', 'cargador-cable', 'cargador'],
    tiers: [
      { quantity: 5, price: 6.5, currency: 'USD' },
      { quantity: 10, price: 5.5, currency: 'USD' },
      { quantity: 20, price: 5, currency: 'USD' },
    ],
  },
  {
    match: ['cable-apple', 'cable apple'],
    tiers: [
      { quantity: 5, price: 3, currency: 'USD' },
      { quantity: 10, price: 3, currency: 'USD' },
      { quantity: 20, price: 3, currency: 'USD' },
    ],
  },
  {
    match: ['cubo-20w', 'cubo 20w', 'cubo'],
    tiers: [
      { quantity: 5, price: 3.5, currency: 'USD' },
      { quantity: 10, price: 3.5, currency: 'USD' },
      { quantity: 20, price: 3.5, currency: 'USD' },
    ],
  },
  {
    match: ['fundas', 'silicon-case', 'silicon case'],
    tiers: [
      { quantity: 5, price: 4200, currency: 'ARS' },
      { quantity: 10, price: 4200, currency: 'ARS' },
      { quantity: 20, price: 3550, currency: 'ARS' },
    ],
  },
  {
    match: ['body-splash', 'body splash'],
    tiers: [
      { quantity: 5, price: 15000, currency: 'ARS' },
      { quantity: 10, price: 14000, currency: 'ARS' },
      { quantity: 20, price: 14000, currency: 'ARS' },
    ],
  },
  {
    match: ['cremas', 'karsell', 'karssell'],
    tiers: [
      { quantity: 5, price: 11.5, currency: 'USD' },
      { quantity: 10, price: 10.5, currency: 'USD' },
      { quantity: 20, price: 10.5, currency: 'USD' },
    ],
  },
  {
    match: ['camiseta', 'afa'],
    tiers: [
      { quantity: 5, price: 15.5, currency: 'USD' },
      { quantity: 10, price: 15, currency: 'USD' },
      { quantity: 20, price: 14.5, currency: 'USD' },
    ],
  },
  {
    match: ['shorts', 'jordan'],
    tiers: [
      { quantity: 5, price: 15.5, currency: 'USD' },
      { quantity: 10, price: 15.5, currency: 'USD' },
      { quantity: 20, price: 15.5, currency: 'USD' },
    ],
  },
  {
    match: ['termo', 'stanley', 'termos'],
    tiers: [
      { quantity: 5, price: 15.5, currency: 'USD' },
      { quantity: 10, price: 13.5, currency: 'USD' },
      { quantity: 20, price: 13.5, currency: 'USD' },
    ],
  },
  {
    match: ['jbl', 'auricular'],
    tiers: [
      { quantity: 5, price: 11, currency: 'USD' },
      { quantity: 10, price: 11, currency: 'USD' },
      { quantity: 20, price: 11, currency: 'USD' },
    ],
  },
  {
    match: ['torch'],
    tiers: [
      { quantity: 5, price: 29.5, currency: 'USD' },
      { quantity: 10, price: 28.5, currency: 'USD' },
      { quantity: 20, price: 26.5, currency: 'USD' },
    ],
  },
  {
    match: ['ignite'],
    tiers: [
      { quantity: 5, price: 15.5, currency: 'USD' },
      { quantity: 10, price: 14.5, currency: 'USD' },
      { quantity: 20, price: 14.5, currency: 'USD' },
    ],
  },
  {
    match: ['elfbar', 'elf-bar', 'sour'],
    tiers: [
      { quantity: 5, price: 14.5, currency: 'USD' },
      { quantity: 10, price: 14, currency: 'USD' },
      { quantity: 20, price: 13.5, currency: 'USD' },
    ],
  },
  {
    match: ['camara', 'foco'],
    tiers: [
      { quantity: 5, price: 13, currency: 'USD' },
      { quantity: 10, price: 13, currency: 'USD' },
      { quantity: 20, price: 13, currency: 'USD' },
    ],
  },
]

export function getBulkTiers(slug: string): BulkTier[] {
  const lower = (slug ?? '').toLowerCase()
  for (const { match, tiers } of PATTERNS) {
    if (match.some((m) => lower.includes(m.toLowerCase()))) return tiers
  }
  return []
}

// Returns first bulk tier (qty 5) — used for best-sellers bulk price display
export function getFirstBulkTier(slug: string): BulkTier | null {
  return getBulkTiers(slug)[0] ?? null
}

export function formatBulkPrice(price: number, currency: Currency): string {
  if (currency === 'USD') {
    const str = price % 1 === 0 ? price.toString() : price.toFixed(2)
    return `USD $${str}`
  }
  return `$${price.toLocaleString('es-AR')}`
}
