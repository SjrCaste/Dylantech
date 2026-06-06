-- ============================================================
-- SEED DATA - Catálogo Dylan Fernaa
-- Ejecutar en el Editor SQL de Supabase DESPUÉS de schema.sql
-- ============================================================

-- ============================================================
-- SETTINGS
-- ============================================================
INSERT INTO settings (key, value) VALUES
  ('company_name',   '"Dylan Fernaa - Lista Mayorista"'),
  ('whatsapp',       '"5491122813943"'),
  ('phone',          '"+54 9 11 2281-3943"'),
  ('email',          '"contacto@dylanfernaa.com"'),
  ('address',        '"Buenos Aires, Argentina"'),
  ('instagram',      '"@dylan_fernaa"'),
  ('facebook',       '""'),
  ('logo',           '""'),
  ('favicon',        '""'),
  ('currency',       '"ARS"'),
  ('currency_symbol','"$"')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- ============================================================
-- HOMEPAGE SECTIONS (actualizar con datos reales)
-- ============================================================
INSERT INTO homepage_sections (section, config, is_visible) VALUES
  ('hero', '{
    "title": "CATÁLOGO 2026",
    "subtitle": "LISTA MAYORISTA",
    "features": ["MÍNIMO X5 UNIDADES","ENVÍOS A TODO EL PAÍS","STOCK PERMANENTE","ENTREGA INMEDIATA"],
    "payment_methods": ["TRANSFERENCIA","EFECTIVO","MERCADO PAGO"],
    "contact_name": "Dylan Etchechuri",
    "contact_ig": "@dylan_fernaa"
  }', true),
  ('benefits', '{
    "title": "¿Por qué elegirnos?",
    "items": [
      {"icon": "truck",       "title": "Envío Rápido",    "description": "Despachamos el mismo día del pago. Vía Cargo, Andreani y Correo Argentino."},
      {"icon": "shield",      "title": "Confianza",       "description": "Videollamada en tiempo real antes del envío. Muchas referencias en Instagram."},
      {"icon": "headphones",  "title": "Asesoramiento",   "description": "Respuesta rápida por WhatsApp y atención personalizada."},
      {"icon": "package",     "title": "Stock Permanente","description": "Stock disponible de manera continua para todos nuestros productos."}
    ]
  }', true),
  ('categories',       '{"title": "Categorías", "subtitle": "Explorá nuestra selección"}', true),
  ('featured_products','{"title": "Más Vendidos", "subtitle": "Los favoritos de nuestros clientes"}', true),
  ('combos',           '{"title": "Combos Emprendedor", "subtitle": "Armá tu kit y ahorrá más"}', true),
  ('testimonials',     '{"title": "Lo que dicen nuestros clientes", "subtitle": "Experiencias reales"}', true),
  ('faqs',             '{"title": "Preguntas Frecuentes", "subtitle": "Todo lo que necesitás saber antes de comprar"}', true),
  ('cta', '{
    "title": "¿Listo para armar tu pedido?",
    "subtitle": "Escribinos por WhatsApp y te cotizamos al toque",
    "button_text": "Consultar ahora",
    "button_url": "https://wa.me/5491122813943?text=Hola!%20Quiero%20consultar%20por%20el%20catálogo%20mayorista"
  }', true)
ON CONFLICT (section) DO UPDATE SET config = EXCLUDED.config, is_visible = EXCLUDED.is_visible;

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO categories (name, slug, description, display_order, is_visible) VALUES
  ('Tecnología',  'tech',        'Smartphones, tablets, smart TVs y cámaras de seguridad',  1, true),
  ('Accesorios',  'accessories', 'Cables, cargadores, fundas y accesorios Apple premium',   2, true),
  ('Perfumería',  'perfumery',   'Body splash VS, cremas Karsell y perfumes árabes',         3, true),
  ('Ropa',        'clothing',    'Camisetas AFA 2026 y shorts deportivos premium',           4, true),
  ('Hogar',       'home',        'Termos Stanley edición Messi y artículos para el hogar',   5, true),
  ('Audio',       'audio',       'Auriculares JBL, AirPods Max y equipos de audio',          6, true),
  ('Vapes',       'vapes',       'Torch 5G, Ignite V400, Elfbar y dispositivos de vaping',   7, true),
  ('Reventa',     'resale',      'iPhones y equipos reacondicionados disponibles',           8, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order;

-- ============================================================
-- PRODUCTS — TECNOLOGÍA
-- ============================================================
INSERT INTO products (
  name, slug, short_description, features, price,
  images, tags, is_featured, is_new, is_on_sale, is_best_seller,
  stock, status, display_order, category_id
) VALUES
(
  'AirPods Pro 2Gen', 'airpods-pro-2', 'SONIDO PREMIUM · ALTA DEMANDA',
  ARRAY['Cancelación de ruido activa','Audio espacial 3D','Estuche con carga MagSafe'],
  22000,
  '[{"url":"/products/airpods-pro-2.png","alt":"AirPods Pro 2Gen","is_primary":true,"order":0}]'::jsonb,
  ARRAY['OFERTA'], true, false, true, true, 99, 'available', 1,
  (SELECT id FROM categories WHERE slug='tech')
),
(
  'TCL 40 NXTPAPER', 'tcl-40-nxtpaper', '256GB / 16GB RAM',
  ARRAY['Pantalla anti-reflejo tipo papel','256GB almacenamiento inmenso','Batería de larga duración'],
  257000,
  '[{"url":"/products/tcl-40-nxtpaper.jpg","alt":"TCL 40 NXTPAPER","is_primary":true,"order":0}]'::jsonb,
  ARRAY[]::text[], false, false, false, false, 99, 'available', 2,
  (SELECT id FROM categories WHERE slug='tech')
),
(
  'Moto G06', 'moto-g06', '128GB / 4GB RAM',
  ARRAY['Pantalla 90Hz ultra fluida','Cámara optimizada con IA','Diseño súper delgado'],
  220000,
  '[{"url":"/products/moto-g06.jpg","alt":"Moto G06","is_primary":true,"order":0}]'::jsonb,
  ARRAY['INCLUYE CARGADOR'], false, false, false, false, 99, 'available', 3,
  (SELECT id FROM categories WHERE slug='tech')
),
(
  'Smart TV 32" Sierra', 'smart-tv-32', 'SELLADA · GARANTIA 1 AÑO',
  ARRAY['Resolución HD brillante','Apps Smart preinstaladas','Sonido inmersivo envolvente'],
  240000,
  '[{"url":"/products/smart-tv-32.jpg","alt":"Smart TV 32 Sierra","is_primary":true,"order":0}]'::jsonb,
  ARRAY[]::text[], false, false, false, false, 99, 'available', 4,
  (SELECT id FROM categories WHERE slug='tech')
),
(
  'Smart TV 43" Quint', 'smart-tv-43', 'SELLADA · GARANTIA 1 AÑO',
  ARRAY['Resolución Full HD 1080p','Diseño elegante sin bordes','Procesador Smart ultra rápido'],
  380000,
  '[{"url":"/products/smart-tv-43.jpg","alt":"Smart TV 43 Quint","is_primary":true,"order":0}]'::jsonb,
  ARRAY[]::text[], false, false, false, false, 99, 'available', 5,
  (SELECT id FROM categories WHERE slug='tech')
),
(
  'Camaras Foco 360', 'camaras-foco-360', 'VISION PANORAMICA · SEGURIDAD 24/7',
  ARRAY['Visión nocturna infrarroja','Detección de movimiento','Audio bidireccional (mic y parlante)'],
  23000,
  '[{"url":"/products/camara-foco-360-new.jpg","alt":"Camaras Foco 360","is_primary":true,"order":0}]'::jsonb,
  ARRAY['LIQUIDACION'], false, false, true, false, 99, 'available', 6,
  (SELECT id FROM categories WHERE slug='tech')
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description,
  features=EXCLUDED.features, price=EXCLUDED.price, images=EXCLUDED.images,
  tags=EXCLUDED.tags, is_featured=EXCLUDED.is_featured, is_new=EXCLUDED.is_new,
  is_on_sale=EXCLUDED.is_on_sale, is_best_seller=EXCLUDED.is_best_seller,
  stock=EXCLUDED.stock, status=EXCLUDED.status,
  display_order=EXCLUDED.display_order, category_id=EXCLUDED.category_id, updated_at=NOW();

-- ============================================================
-- PRODUCTS — ACCESORIOS
-- ============================================================
INSERT INTO products (
  name, slug, short_description, features, price,
  images, tags, is_featured, is_new, is_on_sale, is_best_seller,
  stock, status, display_order, category_id
) VALUES
(
  'Cable Apple 1m C-C', 'cable-apple-cc', 'USB-C a USB-C · MAYORISTA DESDE 5u',
  ARRAY['Carga ultra rápida PD','Material siliconado resistente','Transferencia de datos alta velocidad'],
  3,
  '[{"url":"/products/cable-apple-cc.png","alt":"Cable Apple 1m C-C","is_primary":true,"order":0}]'::jsonb,
  ARRAY['USD'], false, false, false, false, 999, 'available', 1,
  (SELECT id FROM categories WHERE slug='accessories')
),
(
  'Cable Apple 1m C-L', 'cable-apple-cl', 'USB-C a Lightning · MAYORISTA DESDE 5u',
  ARRAY['Carga rápida para iPhone','Conectores reforzados','Calidad de ensamblado premium'],
  3,
  '[{"url":"/products/cable-apple-cl.png","alt":"Cable Apple 1m C-L","is_primary":true,"order":0}]'::jsonb,
  ARRAY['USD'], false, false, false, false, 999, 'available', 2,
  (SELECT id FROM categories WHERE slug='accessories')
),
(
  'Cubo 20W Apple', 'cubo-20w', 'EXCELENTE CALIDAD · MAYORISTA DESDE 5u',
  ARRAY['Carga de 0 a 50% en 30 minutos','Protección contra sobrecargas','Diseño compacto y portátil'],
  3.5,
  '[{"url":"/products/cubo-20w.png","alt":"Cubo 20W Apple","is_primary":true,"order":0}]'::jsonb,
  ARRAY['USD'], false, false, false, false, 999, 'available', 3,
  (SELECT id FROM categories WHERE slug='accessories')
),
(
  'Combo Cargador + Cable', 'combo-cargador', 'CARGA RÁPIDA · USO DIARIO',
  ARRAY['Kit completo listo para usar','Carga ultra rápida 20W','Alta durabilidad garantizada'],
  20000,
  '[{"url":"/products/combo-cargador.png","alt":"Combo Cargador + Cable","is_primary":true,"order":0}]'::jsonb,
  ARRAY['MEJORAMOS PRECIO'], true, false, true, true, 99, 'available', 4,
  (SELECT id FROM categories WHERE slug='accessories')
),
(
  'Fundas Silicon Case', 'fundas-silicon-case', 'CALIDAD PREMIUM · ALTA ROTACIÓN',
  ARRAY['Interior afelpado de microfibra','Tacto suave y antideslizante','Protección 360° ante caídas'],
  10000,
  '[{"url":"/products/fundas-silicon-case.png","alt":"Fundas Silicon Case","is_primary":true,"order":0}]'::jsonb,
  ARRAY[]::text[], false, false, false, true, 99, 'available', 5,
  (SELECT id FROM categories WHERE slug='accessories')
),
(
  'Battery Pack MagSafe', 'battery-pack-magsafe', 'CARGA INALÁMBRICA APPLE',
  ARRAY['Acople magnético perfecto','Carga inalámbrica rápida','Diseño compacto y portátil'],
  25000,
  '[{"url":"/products/battery-pack-magsafe.jpg","alt":"Battery Pack MagSafe","is_primary":true,"order":0}]'::jsonb,
  ARRAY[]::text[], false, false, false, false, 99, 'available', 6,
  (SELECT id FROM categories WHERE slug='accessories')
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description,
  features=EXCLUDED.features, price=EXCLUDED.price, images=EXCLUDED.images,
  tags=EXCLUDED.tags, is_featured=EXCLUDED.is_featured, is_new=EXCLUDED.is_new,
  is_on_sale=EXCLUDED.is_on_sale, is_best_seller=EXCLUDED.is_best_seller,
  stock=EXCLUDED.stock, status=EXCLUDED.status,
  display_order=EXCLUDED.display_order, category_id=EXCLUDED.category_id, updated_at=NOW();

-- ============================================================
-- PRODUCTS — PERFUMERÍA
-- ============================================================
INSERT INTO products (
  name, slug, short_description, features, price,
  images, tags, is_featured, is_new, is_on_sale, is_best_seller,
  stock, status, display_order, category_id
) VALUES
(
  'Body Splash VS', 'body-splash-vs', 'PERFUMES SUPER PEDIDOS',
  ARRAY['Aromas dulces y tropicales','Larga duración en la piel','Ideal para uso diario'],
  20000,
  '[{"url":"/products/body-splash-vs-alt.png","alt":"Body Splash VS","is_primary":true,"order":0},{"url":"/products/body-splash-vs-original.png","alt":"Body Splash VS Original","is_primary":false,"order":1}]'::jsonb,
  ARRAY['REINGRESO'], true, true, false, true, 99, 'available', 1,
  (SELECT id FROM categories WHERE slug='perfumery')
),
(
  'Cremas Karsell', 'cremas-karssell', 'ORIGINAL · ALTA DEMANDA',
  ARRAY['Tratamiento profundo con colágeno','Reparación intensiva de salón','Apto para todo tipo de cabello'],
  25000,
  '[{"url":"/products/cremas-karssell-new.png","alt":"Cremas Karsell","is_primary":true,"order":0}]'::jsonb,
  ARRAY['NUEVO INGRESO'], false, true, false, false, 99, 'available', 2,
  (SELECT id FROM categories WHERE slug='perfumery')
),
(
  'Perfumes Árabes', 'perfumes-arabes', 'EXCLUSIVOS · VARIAS MARCAS',
  ARRAY['Aromas únicos y exóticos','Fijación y proyección extremas','Lattafa, Afnan, Armaf y más...'],
  0,
  '[{"url":"/products/perfumes-arabes.jpg","alt":"Perfumes Árabes","is_primary":true,"order":0}]'::jsonb,
  ARRAY['TENDENCIA','CONSULTAR'], false, false, false, false, 99, 'available', 3,
  (SELECT id FROM categories WHERE slug='perfumery')
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description,
  features=EXCLUDED.features, price=EXCLUDED.price, images=EXCLUDED.images,
  tags=EXCLUDED.tags, is_featured=EXCLUDED.is_featured, is_new=EXCLUDED.is_new,
  is_on_sale=EXCLUDED.is_on_sale, is_best_seller=EXCLUDED.is_best_seller,
  stock=EXCLUDED.stock, status=EXCLUDED.status,
  display_order=EXCLUDED.display_order, category_id=EXCLUDED.category_id, updated_at=NOW();

-- ============================================================
-- PRODUCTS — ROPA
-- ============================================================
INSERT INTO products (
  name, slug, short_description, features, price,
  images, tags, is_featured, is_new, is_on_sale, is_best_seller,
  stock, status, display_order, category_id
) VALUES
(
  'Camiseta Titular AFA 2026', 'camisetas-argentina', 'VERSION HINCHA TAILANDESA · PREMIUM G5',
  ARRAY['Calidad Premium G5 importada','Tela antitranspirante y fresca','Detalles bordados y escudos exactos'],
  35000,
  '[{"url":"/products/camisetas-argentina.png","alt":"Camiseta AFA 2026","is_primary":true,"order":0},{"url":"/products/camisetas-argentina-2.png","alt":"Camiseta AFA 2026 detalle","is_primary":false,"order":1}]'::jsonb,
  ARRAY['mejor precio'], true, false, true, true, 99, 'available', 1,
  (SELECT id FROM categories WHERE slug='clothing')
),
(
  'Shorts Jordan', 'shorts-jordan', 'VARIOS COLORES',
  ARRAY['Tela de secado súper rápido','Ajuste cómodo y diseño deportivo','Logo bordado de alta calidad'],
  30000,
  '[{"url":"/products/shorts-jordan.jpg","alt":"Shorts Jordan","is_primary":true,"order":0}]'::jsonb,
  ARRAY[]::text[], false, false, false, false, 99, 'available', 2,
  (SELECT id FROM categories WHERE slug='clothing')
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description,
  features=EXCLUDED.features, price=EXCLUDED.price, images=EXCLUDED.images,
  tags=EXCLUDED.tags, is_featured=EXCLUDED.is_featured, is_new=EXCLUDED.is_new,
  is_on_sale=EXCLUDED.is_on_sale, is_best_seller=EXCLUDED.is_best_seller,
  stock=EXCLUDED.stock, status=EXCLUDED.status,
  display_order=EXCLUDED.display_order, category_id=EXCLUDED.category_id, updated_at=NOW();

-- ============================================================
-- PRODUCTS — HOGAR
-- ============================================================
INSERT INTO products (
  name, slug, short_description, features, price,
  images, tags, is_featured, is_new, is_on_sale, is_best_seller,
  stock, status, display_order, category_id
) VALUES
(
  'Termos Stanley Messi', 'termo-messi', '1.2L · STOCK LIMITADO',
  ARRAY['Acero inoxidable doble pared al vacío','Mantiene frío/calor por más de 24hs','Edición exclusiva de colección'],
  29000,
  '[{"url":"/products/termo-messi-new.jpg","alt":"Termos Stanley Messi","is_primary":true,"order":0}]'::jsonb,
  ARRAY['NUEVO INGRESO'], true, true, false, false, 50, 'available', 1,
  (SELECT id FROM categories WHERE slug='home')
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description,
  features=EXCLUDED.features, price=EXCLUDED.price, images=EXCLUDED.images,
  tags=EXCLUDED.tags, is_featured=EXCLUDED.is_featured, is_new=EXCLUDED.is_new,
  is_on_sale=EXCLUDED.is_on_sale, is_best_seller=EXCLUDED.is_best_seller,
  stock=EXCLUDED.stock, status=EXCLUDED.status,
  display_order=EXCLUDED.display_order, category_id=EXCLUDED.category_id, updated_at=NOW();

-- ============================================================
-- PRODUCTS — AUDIO
-- ============================================================
INSERT INTO products (
  name, slug, short_description, features, price,
  images, tags, is_featured, is_new, is_on_sale, is_best_seller,
  stock, status, display_order, category_id
) VALUES
(
  'Auriculares JBL', 'auriculares-jbl', 'SONIDO POTENTE · CALIDAD TOP',
  ARRAY['Sonido Pure Bass inmersivo','Batería de extra larga duración','Conexión Bluetooth sin cortes'],
  22000,
  '[{"url":"/products/auriculares-jbl.png","alt":"Auriculares JBL","is_primary":true,"order":0}]'::jsonb,
  ARRAY['LIQUIDACION'], false, false, true, true, 99, 'available', 1,
  (SELECT id FROM categories WHERE slug='audio')
),
(
  'AirPods Max', 'airpods-max', 'La mejor calidad · Sonido premium',
  ARRAY['Audio de alta fidelidad superior','Diseño premium súper ergonómico','Aislamiento acústico avanzado'],
  27000,
  '[{"url":"/products/airpods-max.png","alt":"AirPods Max","is_primary":true,"order":0}]'::jsonb,
  ARRAY['NUEVO'], false, true, false, false, 99, 'available', 2,
  (SELECT id FROM categories WHERE slug='audio')
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description,
  features=EXCLUDED.features, price=EXCLUDED.price, images=EXCLUDED.images,
  tags=EXCLUDED.tags, is_featured=EXCLUDED.is_featured, is_new=EXCLUDED.is_new,
  is_on_sale=EXCLUDED.is_on_sale, is_best_seller=EXCLUDED.is_best_seller,
  stock=EXCLUDED.stock, status=EXCLUDED.status,
  display_order=EXCLUDED.display_order, category_id=EXCLUDED.category_id, updated_at=NOW();

-- ============================================================
-- PRODUCTS — VAPES
-- ============================================================
INSERT INTO products (
  name, slug, short_description, features, price,
  images, tags, is_featured, is_new, is_on_sale, is_best_seller,
  stock, status, display_order, category_id
) VALUES
(
  'Torch 5G', 'torch-5g', 'ALTA POTENCIA · STOCK DISPONIBLE',
  ARRAY['Duración extrema y rendimiento 5G','Sabor intenso, denso y puro','Diseño robusto y recargable'],
  55000,
  '[{"url":"/products/torch-5g.jpg","alt":"Torch 5G","is_primary":true,"order":0}]'::jsonb,
  ARRAY['REINGRESO'], true, false, false, true, 99, 'available', 1,
  (SELECT id FROM categories WHERE slug='vapes')
),
(
  'Ignite V400', 'ignite-v400', 'CALIDAD TOP · STOCK INMEDIATO',
  ARRAY['Completamente libre de mantenimiento','Diseño ultra elegante y compacto','Caladas constantes y súper suaves'],
  30000,
  '[{"url":"/products/ignite-v400.png","alt":"Ignite V400","is_primary":true,"order":0}]'::jsonb,
  ARRAY[]::text[], false, false, false, false, 99, 'available', 2,
  (SELECT id FROM categories WHERE slug='vapes')
),
(
  'Elfbar Sour & Ice King', 'elfbar-ice-king', 'CALIDAD TOP · STOCK INMEDIATO',
  ARRAY['Sabor Sour & Ice fresco inigualable','Listo para usar al instante','Calidad de componentes garantizada'],
  29000,
  '[{"url":"/products/elfbar-ice-king.jpg","alt":"Elfbar Sour & Ice King","is_primary":true,"order":0}]'::jsonb,
  ARRAY['BAJAMOS PRECIOS'], false, false, true, true, 99, 'available', 3,
  (SELECT id FROM categories WHERE slug='vapes')
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description,
  features=EXCLUDED.features, price=EXCLUDED.price, images=EXCLUDED.images,
  tags=EXCLUDED.tags, is_featured=EXCLUDED.is_featured, is_new=EXCLUDED.is_new,
  is_on_sale=EXCLUDED.is_on_sale, is_best_seller=EXCLUDED.is_best_seller,
  stock=EXCLUDED.stock, status=EXCLUDED.status,
  display_order=EXCLUDED.display_order, category_id=EXCLUDED.category_id, updated_at=NOW();

-- ============================================================
-- PRODUCTS — REVENTA
-- ============================================================
INSERT INTO products (
  name, slug, short_description, features, price,
  images, tags, is_featured, is_new, is_on_sale, is_best_seller,
  stock, status, display_order, category_id
) VALUES
(
  'iPhone 13 128GB', 'iphone-13', 'STOCK DISPONIBLE · VARIOS COLORES',
  ARRAY['Condición de batería óptima verificada','Equipos libres de fábrica','Testeo completo de hardware superado'],
  350,
  '[{"url":"/products/iphone-13.png","alt":"iPhone 13 128GB","is_primary":true,"order":0}]'::jsonb,
  ARRAY['USD','INCLUYE FUNDA + CARGADOR'], true, false, false, false, 10, 'available', 1,
  (SELECT id FROM categories WHERE slug='resale')
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, short_description=EXCLUDED.short_description,
  features=EXCLUDED.features, price=EXCLUDED.price, images=EXCLUDED.images,
  tags=EXCLUDED.tags, is_featured=EXCLUDED.is_featured, is_new=EXCLUDED.is_new,
  is_on_sale=EXCLUDED.is_on_sale, is_best_seller=EXCLUDED.is_best_seller,
  stock=EXCLUDED.stock, status=EXCLUDED.status,
  display_order=EXCLUDED.display_order, category_id=EXCLUDED.category_id, updated_at=NOW();

-- ============================================================
-- COMBOS
-- ============================================================
INSERT INTO combos (name, slug, image, description, individual_price, combo_price, savings_display, is_active, display_order) VALUES
(
  'Combo Emprendedor 1', 'combo-emprendedor-1',
  '/combos/combo-1.jpg',
  '3 productos de alta rotación: 2 AirPods Pro 2Gen + 2 Elfbar + 2 Combo Cargador',
  142000, 95000, 'Ahorrás $47.000', true, 1
),
(
  'Combo Emprendedor 2', 'combo-emprendedor-2',
  '/combos/combo-2.jpg',
  '3 productos de alta rotación: 3 AirPods Pro 2Gen + 3 Elfbar + 4 Combo Cargador',
  233000, 135000, 'Ahorrás $98.000', true, 2
),
(
  'Combo Emprendedor 3', 'combo-emprendedor-3',
  '/combos/combo-3.jpg',
  '4 productos de alta rotación: 2 AirPods + 2 Elfbar + 5 Cargadores + 2 Camisetas AFA',
  272000, 150000, 'Ahorrás $122.000', true, 3
),
(
  'Combo Emprendedor 4', 'combo-emprendedor-4',
  '/combos/combo-4.jpg',
  '3 productos de alta rotación: 5 AirPods Pro 2Gen + 5 Combo Cargador + 5 Body Splash VS',
  310000, 170000, 'Ahorrás $140.000', true, 4
),
(
  'Combo Emprendedor 5', 'combo-emprendedor-5',
  '/combos/combo-5.jpg',
  '3 productos de alta rotación: 3 AirPods Pro 2Gen + 5 Fundas Silicon + 5 Combo Cargador',
  216000, 90000, 'Ahorrás $126.000', true, 5
)
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, image=EXCLUDED.image, description=EXCLUDED.description,
  individual_price=EXCLUDED.individual_price, combo_price=EXCLUDED.combo_price,
  savings_display=EXCLUDED.savings_display, is_active=EXCLUDED.is_active,
  display_order=EXCLUDED.display_order, updated_at=NOW();

-- ============================================================
-- COMBO PRODUCTS
-- ============================================================
-- Limpiar existentes para evitar duplicados en re-ejecución
DELETE FROM combo_products
WHERE combo_id IN (
  SELECT id FROM combos
  WHERE slug IN (
    'combo-emprendedor-1','combo-emprendedor-2','combo-emprendedor-3',
    'combo-emprendedor-4','combo-emprendedor-5'
  )
);

-- Combo 1: 2 AirPods + 2 Elfbar + 2 Cargador
INSERT INTO combo_products (combo_id, product_id, quantity)
SELECT (SELECT id FROM combos WHERE slug='combo-emprendedor-1'), (SELECT id FROM products WHERE slug='airpods-pro-2'), 2
WHERE EXISTS (SELECT 1 FROM combos WHERE slug='combo-emprendedor-1') AND EXISTS (SELECT 1 FROM products WHERE slug='airpods-pro-2');
INSERT INTO combo_products (combo_id, product_id, quantity)
SELECT (SELECT id FROM combos WHERE slug='combo-emprendedor-1'), (SELECT id FROM products WHERE slug='elfbar-ice-king'), 2
WHERE EXISTS (SELECT 1 FROM combos WHERE slug='combo-emprendedor-1') AND EXISTS (SELECT 1 FROM products WHERE slug='elfbar-ice-king');
INSERT INTO combo_products (combo_id, product_id, quantity)
SELECT (SELECT id FROM combos WHERE slug='combo-emprendedor-1'), (SELECT id FROM products WHERE slug='combo-cargador'), 2
WHERE EXISTS (SELECT 1 FROM combos WHERE slug='combo-emprendedor-1') AND EXISTS (SELECT 1 FROM products WHERE slug='combo-cargador');

-- Combo 2: 3 AirPods + 3 Elfbar + 4 Cargador
INSERT INTO combo_products (combo_id, product_id, quantity)
SELECT (SELECT id FROM combos WHERE slug='combo-emprendedor-2'), (SELECT id FROM products WHERE slug='airpods-pro-2'), 3
WHERE EXISTS (SELECT 1 FROM combos WHERE slug='combo-emprendedor-2') AND EXISTS (SELECT 1 FROM products WHERE slug='airpods-pro-2');
INSERT INTO combo_products (combo_id, product_id, quantity)
SELECT (SELECT id FROM combos WHERE slug='combo-emprendedor-2'), (SELECT id FROM products WHERE slug='elfbar-ice-king'), 3
WHERE EXISTS (SELECT 1 FROM combos WHERE slug='combo-emprendedor-2') AND EXISTS (SELECT 1 FROM products WHERE slug='elfbar-ice-king');
INSERT INTO combo_products (combo_id, product_id, quantity)
SELECT (SELECT id FROM combos WHERE slug='combo-emprendedor-2'), (SELECT id FROM products WHERE slug='combo-cargador'), 4
WHERE EXISTS (SELECT 1 FROM combos WHERE slug='combo-emprendedor-2') AND EXISTS (SELECT 1 FROM products WHERE slug='combo-cargador');

-- Combo 3: 2 AirPods + 2 Elfbar + 5 Cargador + 2 Camiseta AFA
INSERT INTO combo_products (combo_id, product_id, quantity)
SELECT (SELECT id FROM combos WHERE slug='combo-emprendedor-3'), (SELECT id FROM products WHERE slug='airpods-pro-2'), 2
WHERE EXISTS (SELECT 1 FROM combos WHERE slug='combo-emprendedor-3') AND EXISTS (SELECT 1 FROM products WHERE slug='airpods-pro-2');
INSERT INTO combo_products (combo_id, product_id, quantity)
SELECT (SELECT id FROM combos WHERE slug='combo-emprendedor-3'), (SELECT id FROM products WHERE slug='elfbar-ice-king'), 2
WHERE EXISTS (SELECT 1 FROM combos WHERE slug='combo-emprendedor-3') AND EXISTS (SELECT 1 FROM products WHERE slug='elfbar-ice-king');
INSERT INTO combo_products (combo_id, product_id, quantity)
SELECT (SELECT id FROM combos WHERE slug='combo-emprendedor-3'), (SELECT id FROM products WHERE slug='combo-cargador'), 5
WHERE EXISTS (SELECT 1 FROM combos WHERE slug='combo-emprendedor-3') AND EXISTS (SELECT 1 FROM products WHERE slug='combo-cargador');
INSERT INTO combo_products (combo_id, product_id, quantity)
SELECT (SELECT id FROM combos WHERE slug='combo-emprendedor-3'), (SELECT id FROM products WHERE slug='camisetas-argentina'), 2
WHERE EXISTS (SELECT 1 FROM combos WHERE slug='combo-emprendedor-3') AND EXISTS (SELECT 1 FROM products WHERE slug='camisetas-argentina');

-- Combo 4: 5 AirPods + 5 Cargador + 5 Body Splash
INSERT INTO combo_products (combo_id, product_id, quantity)
SELECT (SELECT id FROM combos WHERE slug='combo-emprendedor-4'), (SELECT id FROM products WHERE slug='airpods-pro-2'), 5
WHERE EXISTS (SELECT 1 FROM combos WHERE slug='combo-emprendedor-4') AND EXISTS (SELECT 1 FROM products WHERE slug='airpods-pro-2');
INSERT INTO combo_products (combo_id, product_id, quantity)
SELECT (SELECT id FROM combos WHERE slug='combo-emprendedor-4'), (SELECT id FROM products WHERE slug='combo-cargador'), 5
WHERE EXISTS (SELECT 1 FROM combos WHERE slug='combo-emprendedor-4') AND EXISTS (SELECT 1 FROM products WHERE slug='combo-cargador');
INSERT INTO combo_products (combo_id, product_id, quantity)
SELECT (SELECT id FROM combos WHERE slug='combo-emprendedor-4'), (SELECT id FROM products WHERE slug='body-splash-vs'), 5
WHERE EXISTS (SELECT 1 FROM combos WHERE slug='combo-emprendedor-4') AND EXISTS (SELECT 1 FROM products WHERE slug='body-splash-vs');

-- Combo 5: 3 AirPods + 5 Fundas + 5 Cargador
INSERT INTO combo_products (combo_id, product_id, quantity)
SELECT (SELECT id FROM combos WHERE slug='combo-emprendedor-5'), (SELECT id FROM products WHERE slug='airpods-pro-2'), 3
WHERE EXISTS (SELECT 1 FROM combos WHERE slug='combo-emprendedor-5') AND EXISTS (SELECT 1 FROM products WHERE slug='airpods-pro-2');
INSERT INTO combo_products (combo_id, product_id, quantity)
SELECT (SELECT id FROM combos WHERE slug='combo-emprendedor-5'), (SELECT id FROM products WHERE slug='fundas-silicon-case'), 5
WHERE EXISTS (SELECT 1 FROM combos WHERE slug='combo-emprendedor-5') AND EXISTS (SELECT 1 FROM products WHERE slug='fundas-silicon-case');
INSERT INTO combo_products (combo_id, product_id, quantity)
SELECT (SELECT id FROM combos WHERE slug='combo-emprendedor-5'), (SELECT id FROM products WHERE slug='combo-cargador'), 5
WHERE EXISTS (SELECT 1 FROM combos WHERE slug='combo-emprendedor-5') AND EXISTS (SELECT 1 FROM products WHERE slug='combo-cargador');

-- ============================================================
-- BANNERS
-- ============================================================
INSERT INTO banners (type, image, title, subtitle, button_text, button_url, is_active, display_order) VALUES
(
  'hero', NULL,
  'CATÁLOGO 2026', 'LISTA MAYORISTA · Precios al por mayor desde 5 unidades',
  'CONSULTAR AHORA',
  'https://wa.me/5491122813943?text=Hola!%20Quiero%20consultar%20por%20el%20catálogo%20mayorista',
  true, 1
),
(
  'secondary', '/combos/combo-1.jpg',
  'Combo Emprendedor 1', '2 AirPods + 2 Elfbar + 2 Cargador — $95.000',
  'Ver combo', '/admin/combos',
  true, 1
),
(
  'secondary', '/combos/combo-2.jpg',
  'Combo Emprendedor 2', '3 AirPods + 3 Elfbar + 4 Cargador — $135.000',
  'Ver combo', '/admin/combos',
  true, 2
),
(
  'secondary', '/combos/combo-3.jpg',
  'Combo Emprendedor 3', '2 AirPods + 2 Elfbar + 5 Cargador + 2 Camiseta AFA — $150.000',
  'Ver combo', '/admin/combos',
  true, 3
),
(
  'secondary', '/combos/combo-4.jpg',
  'Combo Emprendedor 4', '5 AirPods + 5 Cargador + 5 Body Splash — $170.000',
  'Ver combo', '/admin/combos',
  true, 4
),
(
  'secondary', '/combos/combo-5.jpg',
  'Combo Emprendedor 5', '3 AirPods + 5 Fundas + 5 Cargador — $90.000',
  'Ver combo', '/admin/combos',
  true, 5
);

-- ============================================================
-- FAQs (extraídas del OrderGuide)
-- ============================================================
INSERT INTO faqs (question, answer, display_order, is_active) VALUES
(
  '¿Cómo hago un pedido?',
  'Paso 1: Mandanos tu pedido al privado indicando producto y cantidad. Ejemplo: "Hola Dylan, me interesan 5 AirPods y 5 Camisetas Arg, ¿cuánto quedaría el precio final? Soy de Buenos Aires, ¿puedo retirar o envío?"

Paso 2: Te cotizamos el total, coordinamos la entrega y la forma de pago.',
  1, true
),
(
  '¿Hacen envíos a todo el país?',
  'Sí. Despachamos vía Cargo, Andreani y Correo Argentino a todo el país.

Si es por envío, el pago se confirma antes del despacho por Transferencia o USDT. Despachamos el mismo día que se realiza el pago.',
  2, true
),
(
  '¿Cómo funciona el retiro en persona?',
  'Si retirás en persona, el pago se realiza en el momento de retiro en Efectivo, Transferencia o Dólares. Coordinamos el punto de encuentro según tu zona.',
  3, true
),
(
  '¿Cuáles son los medios de pago?',
  'Aceptamos Efectivo, Transferencia bancaria, USD (billete), USDT y Mercado Pago.

Los precios en dólares se cotizan al Dólar Blue Venta al momento del pago en ARS.',
  4, true
),
(
  '¿Cuándo se aplica el precio mayorista?',
  'El precio mayorista en USD se aplica a partir de 5 unidades del mismo producto. Para compras de 1 unidad, el precio es el indicado en ARS.',
  5, true
),
(
  '¿Cómo puedo confiar si el pedido es por envío?',
  'Ofrecemos todas estas garantías:
1. Hacemos videollamada en tiempo real con tu pedido antes del envío.
2. Podés ver mi Instagram (@dylan_fernaa) donde tengo referencias de clientes.
3. Al momento del despacho, te enviamos el seguimiento de tu pedido.',
  6, true
),
(
  '¿Los precios están actualizados?',
  'Los precios son válidos sujetos a stock disponible. Los productos en USD pueden variar según la cotización del dólar. Consultá disponibilidad antes de confirmar el pedido.',
  7, true
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- TESTIMONIALS
-- ============================================================
INSERT INTO testimonials (name, comment, rating, date, is_active, display_order) VALUES
(
  'Martina G.',
  'Compré 10 AirPods Pro para revender y llegaron perfectos. Videollamada antes del envío, todo muy transparente. Ya hice mi segundo pedido.',
  5, '2026-05-10', true, 1
),
(
  'Lucas R.',
  'Los combos emprendedor son una joya. Me armé un stock completo para vender en el barrio y la ganancia fue increíble. Muy recomendable.',
  5, '2026-05-18', true, 2
),
(
  'Valentina S.',
  'Pedí camisetas AFA y llegaron en perfecto estado, calidad G5 como prometían. El envío tardó 2 días. Volvería a comprar sin dudas.',
  5, '2026-05-22', true, 3
),
(
  'Rodrigo M.',
  'Excelente atención, responde rápido por WhatsApp. Compré Elfbar y AirPods, todo llegó bien embalado. 100% recomendable.',
  5, '2026-05-29', true, 4
),
(
  'Carolina F.',
  'Compré perfumes árabes para regalar, calidad increíble y precio mayorista justo. Dylan siempre disponible para cualquier consulta.',
  5, '2026-06-01', true, 5
)
ON CONFLICT DO NOTHING;
