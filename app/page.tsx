"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { BestSellers } from "@/components/best-sellers"
import { CategoryNav } from "@/components/category-nav"
import { ProductSection } from "@/components/product-section"
import { ComboSection } from "@/components/combo-section"
import { ResaleSection } from "@/components/resale-section"
import { WholesaleSection } from "@/components/wholesale-section"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { products } from "@/lib/products"

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = [
    { id: "resale", label: "iPhones" },
    { id: "wholesale", label: "Mayorista" },
    { id: "tech", label: "Tecnología" },
    { id: "accessories", label: "Accesorios" },
    { id: "audio", label: "Audio" },
    { id: "perfumery", label: "Perfumería" },
    { id: "clothing", label: "Ropa" },
    { id: "home", label: "Hogar" },
    { id: "vapes", label: "Vapes" },
    { id: "combos", label: "Combos" },
  ]

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId)
    const element = document.getElementById(categoryId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner />
        <BestSellers />
        <CategoryNav 
          categories={categories} 
          activeCategory={activeCategory}
          onCategoryClick={scrollToCategory}
        />
        
        <div className="space-y-8 pb-32">
          <ResaleSection />
          <WholesaleSection />
          
          <ProductSection 
            id="tech"
            title="Tecnología & Celulares"
            products={products.tech}
          />
          <ProductSection 
            id="accessories"
            title="Accesorios & Carga"
            products={products.accessories}
          />
          <ProductSection 
            id="audio"
            title="Audio"
            products={products.audio}
          />
          <ProductSection 
            id="perfumery"
            title="Perfumería & Cuidado"
            products={products.perfumery}
          />
          <ProductSection 
            id="clothing"
            title="Indumentaria"
            products={products.clothing}
          />
          <ProductSection 
            id="home"
            title="Hogar & Varios"
            products={products.home}
          />
          <ProductSection 
            id="vapes"
            title="Vapeadores"
            products={products.vapes}
          />
          <ComboSection />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
