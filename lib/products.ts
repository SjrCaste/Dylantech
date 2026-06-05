export interface PriceTier {
  quantity: number
  price: number
  currency: "USD" | "ARS"
  label?: string
}

export interface Product {
  id: string
  name: string
  subtitle?: string
  description?: string
  basePrice: number
  currency: "USD" | "ARS"
  minQuantity: number
  priceTiers?: PriceTier[]
  badge?: string
  hasWarranty?: string
  features?: string[]
  image?: string
  images?: string[]
}

export interface Combo {
  id: string
  name: string
  subtitle?: string
  price: number
  currency: "ARS"
  items: {
    product: string
    quantity: number
  }[]
  badge?: string
  image?: string
}

export const products = {
  tech: [
    {
      id: "airpods-pro-2",
      name: "AirPods Pro 2Gen",
      subtitle: "SONIDO PREMIUM · ALTA DEMANDA",
      basePrice: 22000,
      currency: "ARS" as const,
      minQuantity: 5,
      badge: "OFERTA",
      image: "/products/airpods-pro-2.png",
      priceTiers: [
        { quantity: 5, price: 9.5, currency: "USD" as const },
        { quantity: 10, price: 8.5, currency: "USD" as const },
        { quantity: 30, price: 7.5, currency: "USD" as const },
      ],
    },

    {
      id: "tcl-40-nxtpaper",
      name: "TCL 40 NXTPAPER",
      subtitle: "256GB / 16GB RAM",
      basePrice: 257000,
      currency: "ARS" as const,
      minQuantity: 1,
      image: "/products/tcl-40-nxtpaper.jpg",
    },

    {
      id: "moto-g06",
      name: "Moto G06",
      subtitle: "128GB / 4GB RAM",
      basePrice: 220000,
      currency: "ARS" as const,
      minQuantity: 1,
      hasWarranty: "INCLUYE CARGADOR",
      image: "/products/moto-g06.jpg",
    },

    {
      id: "smart-tv-32",
      name: "Smart TV 32\" Sierra",
      subtitle: "SELLADA · GARANTIA 1 ANO",
      basePrice: 240000,
      currency: "ARS" as const,
      minQuantity: 1,
      image: "/products/smart-tv-32.jpg",
    },
    {
      id: "smart-tv-43",
      name: "Smart TV 43\" Quint",
      subtitle: "SELLADA · GARANTIA 1 ANO",
      basePrice: 380000,
      currency: "ARS" as const,
      minQuantity: 1,
      image: "/products/smart-tv-43.jpg",
    },
    {
      id: "camaras-foco-360",
      name: "Camaras Foco 360",
      subtitle: "VISION PANORAMICA · SEGURIDAD 24/7",
      basePrice: 23000,
      currency: "ARS" as const,
      minQuantity: 5,
      badge: "LIQUIDACION",
      image: "/products/camara-foco-360-new.jpg",
      priceTiers: [
        { quantity: 5, price: 13, currency: "USD" as const },
      ],
    },
  ],
  accessories: [
    {
      id: "cable-apple-cc",
      name: "Cable Apple 1m",
      subtitle: "C–C",
      basePrice: 3,
      currency: "USD" as const,
      minQuantity: 5,
      image: "/products/cable-apple-cc.png",
    },
    {
      id: "cable-apple-cl",
      name: "Cable Apple 1m",
      subtitle: "C–L",
      basePrice: 3,
      currency: "USD" as const,
      minQuantity: 5,
      image: "/products/cable-apple-cl.png",
    },
    {
      id: "cubo-20w",
      name: "Cubo 20W Apple",
      subtitle: "EXCELENTE CALIDAD",
      basePrice: 3.5,
      currency: "USD" as const,
      minQuantity: 5,
      image: "/products/cubo-20w.png",
    },
    {
      id: "combo-cargador",
      name: "Combo Cargador + Cable",
      subtitle: "CARGA RÁPIDA · USO DIARIO",
      basePrice: 20000,
      currency: "ARS" as const,
      minQuantity: 1,
      badge: "MEJORAMOS PRECIO",
      image: "/products/combo-cargador.png",
      priceTiers: [
        { quantity: 1, price: 20000, currency: "ARS" as const },
        { quantity: 5, price: 6.5, currency: "USD" as const },
        { quantity: 15, price: 5.5, currency: "USD" as const },
        { quantity: 30, price: 5, currency: "USD" as const },
        { quantity: 80, price: 3.8, currency: "USD" as const },
      ],
    },

    {
      id: "fundas-silicon-case",
      name: "Fundas Silicon Case",
      subtitle: "CALIDAD PREMIUM · ALTA ROTACIÓN",
      basePrice: 10000,
      currency: "ARS" as const,
      minQuantity: 1,
      image: "/products/fundas-silicon-case.png",
      priceTiers: [
        { quantity: 1, price: 10000, currency: "ARS" as const },
        { quantity: 10, price: 4200, currency: "ARS" as const },
        { quantity: 20, price: 3550, currency: "ARS" as const },
        { quantity: 50, price: 2900, currency: "ARS" as const },
      ],
    },


  ],
  perfumery: [
    {
      id: "body-splash-vs",
      name: "Body Splash VS",
      subtitle: "PERFUMES SUPER PEDIDOS",
      basePrice: 20000,
      currency: "ARS" as const,
      minQuantity: 1,
      badge: "REINGRESO",
      image: "/products/body-splash-vs-alt.png",
      priceTiers: [
        { quantity: 1, price: 20000, currency: "ARS" as const },
        { quantity: 5, price: 15000, currency: "ARS" as const },
        { quantity: 15, price: 14000, currency: "ARS" as const },
      ],
    },
    {
      id: "body-splash-vs-original",
      name: "Body Splash VS",
      subtitle: "ORIGINAL",
      basePrice: 20000,
      currency: "ARS" as const,
      minQuantity: 1,
      image: "/products/body-splash-vs-original.png",
      priceTiers: [
        { quantity: 1, price: 20000, currency: "ARS" as const },
        { quantity: 5, price: 15000, currency: "ARS" as const },
        { quantity: 15, price: 14000, currency: "ARS" as const },
      ],
    },

    {
      id: "cremas-karssell",
      name: "Cremas Karsell",
      subtitle: "ORIGINAL · ALTA DEMANDA",
      basePrice: 25000,
      currency: "ARS" as const,
      minQuantity: 1,
      badge: "NUEVO INGRESO",
      image: "/products/cremas-karssell-new.png",
      priceTiers: [
        { quantity: 1, price: 25000, currency: "ARS" as const },
        { quantity: 5, price: 11.5, currency: "USD" as const },
        { quantity: 10, price: 10.5, currency: "USD" as const },
      ],
    },
  ],
  clothing: [
    {
      id: "camisetas-argentina",
      name: "Camiseta Titular AFA 2026",
      subtitle: "VERSION HINCHA TAILANDESA · PREMIUM G5",
      basePrice: 35000,
      currency: "ARS" as const,
      minQuantity: 1,
      badge: "mejor precio",
      image: "/products/camisetas-argentina.png",
      images: [
        "/products/camisetas-argentina.png",
        "/products/camisetas-argentina-2.png"
      ],
      priceTiers: [
        { quantity: 1, price: 35000, currency: "ARS" as const },
        { quantity: 5, price: 15.5, currency: "USD" as const },
        { quantity: 15, price: 15, currency: "USD" as const },
        { quantity: 20, price: 14.5, currency: "USD" as const },
        { quantity: 30, price: 13.5, currency: "USD" as const },
      ],
    },
    {
      id: "shorts-jordan",
      name: "Shorts Jordan",
      subtitle: "VARIOS COLORES",
      basePrice: 20,
      currency: "USD" as const,
      minQuantity: 5,
      image: "/products/shorts-jordan.jpg",
    },
  ],
  home: [
    {
      id: "termo-messi",
      name: "Termos Stanley Messi",
      subtitle: "1.2L · STOCK LIMITADO",
      basePrice: 29000,
      currency: "ARS" as const,
      minQuantity: 5,
      badge: "NUEVO INGRESO",
      image: "/products/termo-messi-new.jpg",
      priceTiers: [
        { quantity: 5, price: 15.5, currency: "USD" as const },
        { quantity: 10, price: 13.5, currency: "USD" as const },
      ],
    },

  ],
  audio: [
    {
      id: "auriculares-jbl",
      name: "Auriculares JBL",
      subtitle: "SONIDO POTENTE · CALIDAD TOP",
      basePrice: 22000,
      currency: "ARS" as const,
      minQuantity: 1,
      badge: "LIQUIDACION",
      image: "/products/auriculares-jbl.png",
      priceTiers: [
        { quantity: 1, price: 22000, currency: "ARS" as const },
        { quantity: 5, price: 11, currency: "USD" as const },
      ],
    },
    {
      id: "airpods-max",
      name: "AirPods Max",
      subtitle: "La mejor calidad | Sonido premium",
      basePrice: 27000,
      currency: "ARS" as const,
      minQuantity: 1,
      badge: "🔥 NUEVO",
      image: "/products/airpods-max.png",
      priceTiers: [
        { quantity: 5, price: 15, currency: "USD" as const },
      ],
    },
  ],
  vapes: [

    {
      id: "torch-5g",
      name: "Torch 5G",
      subtitle: "ALTA POTENCIA · STOCK DISPONIBLE",
      basePrice: 55000,
      currency: "ARS" as const,
      minQuantity: 5,
      badge: "REINGRESO",
      image: "/products/torch-5g.jpg",
      priceTiers: [
        { quantity: 5, price: 29.5, currency: "USD" as const },
        { quantity: 10, price: 28.5, currency: "USD" as const },
        { quantity: 20, price: 26.5, currency: "USD" as const },
      ],
    },
    {
      id: "ignite-v400",
      name: "Ignite V400",
      subtitle: "CALIDAD TOP · STOCK INMEDIATO",
      basePrice: 30000,
      currency: "ARS" as const,
      minQuantity: 5,
      image: "/products/ignite-v400.png",
      priceTiers: [
        { quantity: 5, price: 15.5, currency: "USD" as const },
        { quantity: 15, price: 14.5, currency: "USD" as const },
        { quantity: 30, price: 13.8, currency: "USD" as const },
      ],
    },
    {
      id: "elfbar-ice-king",
      name: "Elfbar Sour & Ice King",
      subtitle: "CALIDAD TOP · STOCK INMEDIATO",
      basePrice: 29000,
      currency: "ARS" as const,
      minQuantity: 5,
      badge: "BAJAMOS PRECIOS",
      image: "/products/elfbar-ice-king.jpg",
      priceTiers: [
        { quantity: 5, price: 14.5, currency: "USD" as const },
        { quantity: 15, price: 14, currency: "USD" as const },
        { quantity: 30, price: 13.5, currency: "USD" as const },
        { quantity: 100, price: 12, currency: "USD" as const },
      ],
    },
  ],
  resale: [
    {
      id: "iphone-13",
      name: "iPhone 13 128GB",
      subtitle: "STOCK DISPONIBLE · VARIOS COLORES",
      basePrice: 350,
      currency: "USD" as const,
      minQuantity: 1,
      hasWarranty: "INCLUYE FUNDA + CARGADOR",
      image: "/products/iphone-13.png",
    },
  ],
  combos: [
    {
      id: "combo-emprendedor-1",
      name: "Combo Emprendedor 1",
      subtitle: "3 PRODUCTOS DE ALTA ROTACION",
      price: 95000,
      currency: "ARS" as const,
      badge: "OFERTA",
      image: "/combos/combo-1.jpg",
      items: [
        { product: "AirPods Pro 2Gen", quantity: 2 },
        { product: "Elfbar Ice King", quantity: 2 },
        { product: "Combo Cargador", quantity: 2 },
      ],
    },
    {
      id: "combo-emprendedor-2",
      name: "Combo Emprendedor 2",
      subtitle: "3 PRODUCTOS DE ALTA ROTACION",
      price: 135000,
      currency: "ARS" as const,
      badge: "OFERTA",
      image: "/combos/combo-2.jpg",
      items: [
        { product: "AirPods Pro 2Gen", quantity: 3 },
        { product: "Elfbar Ice King", quantity: 3 },
        { product: "Combo Cargador", quantity: 4 },
      ],
    },
    {
      id: "combo-emprendedor-3",
      name: "Combo Emprendedor 3",
      subtitle: "4 PRODUCTOS DE ALTA ROTACION",
      price: 150000,
      currency: "ARS" as const,
      badge: "OFERTA",
      image: "/combos/combo-3.jpg",
      items: [
        { product: "AirPods Pro 2Gen", quantity: 2 },
        { product: "Elfbar Ice King", quantity: 2 },
        { product: "Combo Cargador", quantity: 5 },
        { product: "Camiseta Titular AFA", quantity: 2 },
      ],
    },
    {
      id: "combo-emprendedor-4",
      name: "Combo Emprendedor 4",
      subtitle: "3 PRODUCTOS DE ALTA ROTACION",
      price: 170000,
      currency: "ARS" as const,
      badge: "OFERTA",
      image: "/combos/combo-4.jpg",
      items: [
        { product: "AirPods Pro 2Gen", quantity: 5 },
        { product: "Combo Cargador", quantity: 5 },
        { product: "Body Splash VS", quantity: 5 },
      ],
    },
    {
      id: "combo-emprendedor-5",
      name: "Combo Emprendedor 5",
      subtitle: "3 PRODUCTOS DE ALTA ROTACION",
      price: 90000,
      currency: "ARS" as const,
      badge: "OFERTA",
      image: "/combos/combo-5.jpg",
      items: [
        { product: "AirPods Pro 2Gen", quantity: 3 },
        { product: "Fundas Silicon Case", quantity: 5 },
        { product: "Combo Cargador", quantity: 5 },
      ],
    },
  ],
}
