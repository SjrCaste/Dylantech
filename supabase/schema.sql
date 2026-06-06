-- ============================================================
-- PRODUCT CATALOG ADMIN - DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image TEXT,
  banner_image TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUBCATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  promotional_price NUMERIC(12, 2),
  sku TEXT,
  stock INTEGER DEFAULT 0,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'out_of_stock')),
  tags TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  usage_instructions TEXT,
  recommendations TEXT,
  images JSONB DEFAULT '[]',
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_recommended BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COMBOS
-- ============================================================
CREATE TABLE IF NOT EXISTS combos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  description TEXT,
  individual_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  combo_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  savings_display TEXT,
  benefits TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS combo_products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  combo_id UUID REFERENCES combos(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1
);

-- ============================================================
-- BANNERS
-- ============================================================
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'secondary' CHECK (type IN ('hero', 'secondary')),
  image TEXT,
  title TEXT,
  subtitle TEXT,
  button_text TEXT,
  button_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  photo TEXT,
  comment TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FAQS
-- ============================================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- HOMEPAGE SECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  config JSONB DEFAULT '{}',
  is_visible BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ACTIVITY LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  resource_name TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_category ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_combo_products_combo ON combo_products(combo_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER update_combos_updated_at
  BEFORE UPDATE ON combos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER update_sections_updated_at
  BEFORE UPDATE ON homepage_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE combo_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Public read subcategories" ON subcategories;
DROP POLICY IF EXISTS "Public read combos" ON combos;
DROP POLICY IF EXISTS "Public read combo_products" ON combo_products;
DROP POLICY IF EXISTS "Public read banners" ON banners;
DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
DROP POLICY IF EXISTS "Public read faqs" ON faqs;
DROP POLICY IF EXISTS "Public read sections" ON homepage_sections;
DROP POLICY IF EXISTS "Public read settings" ON settings;

DROP POLICY IF EXISTS "Admin all products" ON products;
DROP POLICY IF EXISTS "Admin all categories" ON categories;
DROP POLICY IF EXISTS "Admin all subcategories" ON subcategories;
DROP POLICY IF EXISTS "Admin all combos" ON combos;
DROP POLICY IF EXISTS "Admin all combo_products" ON combo_products;
DROP POLICY IF EXISTS "Admin all banners" ON banners;
DROP POLICY IF EXISTS "Admin all testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin all faqs" ON faqs;
DROP POLICY IF EXISTS "Admin all sections" ON homepage_sections;
DROP POLICY IF EXISTS "Admin all settings" ON settings;
DROP POLICY IF EXISTS "Admin all activity" ON activity_log;

CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read subcategories" ON subcategories FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read combos" ON combos FOR SELECT USING (is_active = true);
CREATE POLICY "Public read combo_products" ON combo_products FOR SELECT USING (true);
CREATE POLICY "Public read banners" ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read sections" ON homepage_sections FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

-- Authenticated (admin) full access
CREATE POLICY "Admin all products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all subcategories" ON subcategories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all combos" ON combos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all combo_products" ON combo_products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all banners" ON banners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all sections" ON homepage_sections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all settings" ON settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all activity" ON activity_log FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- INITIAL DATA
-- ============================================================
INSERT INTO homepage_sections (section, config, is_visible) VALUES
  ('hero', '{"title": "Tu Catálogo de Productos", "subtitle": "Los mejores productos al mejor precio", "button_text": "Ver Catálogo", "button_url": "#productos", "image": ""}', true),
  ('benefits', '{"title": "¿Por qué elegirnos?", "items": [{"icon": "truck", "title": "Envío Rápido", "description": "Entregamos en todo el país"}, {"icon": "shield", "title": "Garantía", "description": "Productos con garantía oficial"}, {"icon": "headphones", "title": "Soporte", "description": "Atención personalizada 24/7"}]}', true),
  ('categories', '{"title": "Categorías", "subtitle": "Explora nuestra selección"}', true),
  ('featured_products', '{"title": "Productos Destacados", "subtitle": "Los favoritos de nuestros clientes"}', true),
  ('combos', '{"title": "Combos Especiales", "subtitle": "Ahorrá más comprando en combo"}', true),
  ('testimonials', '{"title": "Lo que dicen nuestros clientes", "subtitle": "Experiencias reales"}', true),
  ('faqs', '{"title": "Preguntas Frecuentes", "subtitle": "Todo lo que necesitás saber"}', true),
  ('cta', '{"title": "¿Listo para comprar?", "subtitle": "Contactanos por WhatsApp y te asesoramos", "button_text": "Contactar ahora", "button_url": "https://wa.me/"}', true)
ON CONFLICT (section) DO NOTHING;

INSERT INTO settings (key, value) VALUES
  ('company_name', '"Mi Empresa"'),
  ('whatsapp', '"+54 9 11 0000-0000"'),
  ('phone', '"+54 11 0000-0000"'),
  ('email', '"contacto@miempresa.com"'),
  ('address', '"Buenos Aires, Argentina"'),
  ('instagram', '"@miempresa"'),
  ('facebook', '"miempresa"'),
  ('logo', '""'),
  ('favicon', '""'),
  ('currency', '"ARS"'),
  ('currency_symbol', '"$"')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- STORAGE BUCKET (run separately if needed)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('catalog-images', 'catalog-images', true) ON CONFLICT DO NOTHING;
-- CREATE POLICY "Public read" ON storage.objects FOR SELECT USING (bucket_id = 'catalog-images');
-- CREATE POLICY "Auth upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'catalog-images' AND auth.role() = 'authenticated');
-- CREATE POLICY "Auth update" ON storage.objects FOR UPDATE USING (bucket_id = 'catalog-images' AND auth.role() = 'authenticated');
-- CREATE POLICY "Auth delete" ON storage.objects FOR DELETE USING (bucket_id = 'catalog-images' AND auth.role() = 'authenticated');
