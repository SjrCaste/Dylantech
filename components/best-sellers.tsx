"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

const bestSellers = [
  {
    id: "combo-cargador",
    image: "/products/combo-cargador.png",
    name: "Cargador + Cable",
    price: "3.8",
    currency: "USD",
  },
  {
    id: "airpods-pro-2",
    image: "/products/airpods-pro-2.png",
    name: "AirPods Pro 2Gen",
    price: "7.2",
    currency: "USD",
  },
  {
    id: "torch-5g",
    image: "/products/torch-5g.jpg",
    name: "Torch 5G",
    price: "24.5",
    currency: "USD",
  },
  {
    id: "body-splash-vs",
    image: "/products/body-splash-vs-alt.png",
    name: "Body Splash VS",
    price: "7",
    currency: "USD",
  },
  {
    id: "ignite-v400",
    image: "/products/ignite-v400.png",
    name: "Ignite V400",
    price: "13.8",
    currency: "USD",
  },
  {
    id: "elfbar-ice-king",
    image: "/products/elfbar-ice-king.jpg",
    name: "Elfbar Sour & Ice King",
    price: "12",
    currency: "USD",
  },
  {
    id: "camisetas-argentina",
    image: "/products/camisetas-argentina.png",
    name: "Camiseta Argentina",
    price: "12",
    currency: "USD",
  },
]

export function BestSellers() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section className="border-b border-border/50 bg-card/30 px-4 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
            Más Vendidos
          </h2>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {bestSellers.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className={`flex min-w-[140px] flex-col items-center gap-2 rounded-xl border border-border/50 bg-card p-4 transition-all duration-200 ${
                hoveredId === item.id 
                  ? "border-accent/50 bg-accent/5" 
                  : "hover:border-border"
              }`}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-secondary/40">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-0.5"
                  sizes="64px"
                />
              </div>
              <span className="text-center text-xs font-medium text-foreground">
                {item.name}
              </span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xs text-muted-foreground">hasta</span>
                <span className="ml-1 text-lg font-bold text-accent">
                  {item.price}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.currency}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
