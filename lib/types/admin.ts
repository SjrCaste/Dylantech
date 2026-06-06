export interface ProductImage {
  url: string
  alt: string
  is_primary: boolean
  order: number
}

export interface Product {
  id: string
  name: string
  slug: string
  short_description: string | null
  description: string | null
  category_id: string | null
  subcategory_id: string | null
  price: number
  promotional_price: number | null
  sku: string | null
  stock: number
  status: 'available' | 'out_of_stock'
  tags: string[]
  benefits: string[]
  features: string[]
  usage_instructions: string | null
  recommendations: string | null
  images: ProductImage[]
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string[]
  is_featured: boolean
  is_new: boolean
  is_on_sale: boolean
  is_best_seller: boolean
  is_recommended: boolean
  display_order: number
  created_at: string
  updated_at: string
  category?: Category
  subcategory?: Subcategory
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  cover_image: string | null
  banner_image: string | null
  display_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
  product_count?: number
}

export interface Subcategory {
  id: string
  name: string
  slug: string
  category_id: string
  display_order: number
  is_visible: boolean
  created_at: string
  category?: Category
}

export interface Combo {
  id: string
  name: string
  slug: string
  image: string | null
  description: string | null
  individual_price: number
  combo_price: number
  savings_display: string | null
  benefits: string[]
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
  combo_products?: ComboProduct[]
}

export interface ComboProduct {
  id: string
  combo_id: string
  product_id: string
  quantity: number
  product?: Product
}

export interface Banner {
  id: string
  type: 'hero' | 'secondary'
  image: string | null
  title: string | null
  subtitle: string | null
  button_text: string | null
  button_url: string | null
  is_active: boolean
  display_order: number
  created_at: string
}

export interface Testimonial {
  id: string
  name: string
  photo: string | null
  comment: string
  rating: number
  date: string
  is_active: boolean
  display_order: number
  created_at: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  display_order: number
  is_active: boolean
  created_at: string
}

export interface HomepageSection {
  id: string
  section: string
  config: Record<string, unknown>
  is_visible: boolean
  updated_at: string
}

export interface AppSettings {
  company_name: string
  whatsapp: string
  phone: string
  email: string
  address: string
  instagram: string
  facebook: string
  logo: string
  favicon: string
  currency: string
  currency_symbol: string
}

export interface ActivityLog {
  id: string
  user_id: string | null
  user_email: string | null
  action: string
  resource_type: string
  resource_id: string | null
  resource_name: string | null
  details: Record<string, unknown>
  created_at: string
}

export interface DashboardStats {
  total_products: number
  total_categories: number
  total_combos: number
  featured_products: number
  out_of_stock: number
  new_products: number
  on_sale: number
  recent_products: Product[]
}

export type ProductStatus = 'available' | 'out_of_stock'
export type BannerType = 'hero' | 'secondary'
