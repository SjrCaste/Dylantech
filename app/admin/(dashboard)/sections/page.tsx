'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Save, Loader2, Eye, EyeOff, LayoutTemplate } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { HomepageSection } from '@/lib/types/admin'

const SECTION_LABELS: Record<string, { label: string; description: string; fields: string[] }> = {
  hero: { label: 'Hero Principal', description: 'Sección de bienvenida al inicio del sitio', fields: ['title', 'subtitle', 'button_text', 'button_url', 'image'] },
  benefits: { label: 'Beneficios', description: 'Por qué elegirnos', fields: ['title'] },
  categories: { label: 'Categorías Destacadas', description: 'Grid de categorías', fields: ['title', 'subtitle'] },
  featured_products: { label: 'Productos Destacados', description: 'Sección de productos seleccionados', fields: ['title', 'subtitle'] },
  combos: { label: 'Combos Especiales', description: 'Grid de combos', fields: ['title', 'subtitle'] },
  testimonials: { label: 'Testimonios', description: 'Reseñas de clientes', fields: ['title', 'subtitle'] },
  faqs: { label: 'Preguntas Frecuentes', description: 'Sección de FAQ', fields: ['title', 'subtitle'] },
  cta: { label: 'Llamada a la Acción (CTA)', description: 'Sección final con botón de contacto', fields: ['title', 'subtitle', 'button_text', 'button_url'] },
}

const FIELD_LABELS: Record<string, string> = {
  title: 'Título',
  subtitle: 'Subtítulo',
  button_text: 'Texto del botón',
  button_url: 'URL del botón',
  image: 'URL de imagen de fondo',
}

export default function SectionsPage() {
  const [sections, setSections] = useState<HomepageSection[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [configs, setConfigs] = useState<Record<string, Record<string, unknown>>>({})
  const [visibilities, setVisibilities] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch('/api/admin/sections')
      .then((r) => r.json())
      .then(({ data }) => {
        setSections(data ?? [])
        const cfgs: Record<string, Record<string, unknown>> = {}
        const vis: Record<string, boolean> = {}
        for (const s of data ?? []) {
          cfgs[s.section] = s.config ?? {}
          vis[s.section] = s.is_visible
        }
        setConfigs(cfgs)
        setVisibilities(vis)
        setLoading(false)
      })
  }, [])

  async function saveSection(sectionKey: string) {
    setSaving(sectionKey)
    const res = await fetch('/api/admin/sections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: sectionKey,
        config: configs[sectionKey] ?? {},
        is_visible: visibilities[sectionKey] ?? true,
      }),
    })
    if (res.ok) toast.success('Sección guardada correctamente')
    else toast.error('Error al guardar la sección')
    setSaving(null)
  }

  function updateField(sectionKey: string, field: string, value: string) {
    setConfigs((prev) => ({
      ...prev,
      [sectionKey]: { ...(prev[sectionKey] ?? {}), [field]: value },
    }))
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Secciones del sitio</h1>
        <p className="text-sm text-zinc-400 mt-0.5">Editá el contenido de cada sección de la página de inicio sin tocar código</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(SECTION_LABELS).map(([sectionKey, meta]) => {
            const isSaving = saving === sectionKey
            const isVisible = visibilities[sectionKey] ?? true
            const config = configs[sectionKey] ?? {}

            return (
              <div key={sectionKey} className={`bg-white dark:bg-zinc-900 rounded-xl border transition-colors ${isVisible ? 'border-zinc-200 dark:border-zinc-800' : 'border-zinc-200 dark:border-zinc-800 opacity-60'}`}>
                <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center">
                      <LayoutTemplate className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{meta.label}</h3>
                      <p className="text-xs text-zinc-400">{meta.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {isVisible ? <Eye className="w-3.5 h-3.5 text-zinc-400" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-400" />}
                      <Switch
                        checked={isVisible}
                        onCheckedChange={(v) => setVisibilities((prev) => ({ ...prev, [sectionKey]: v }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {meta.fields.map((field) => (
                      <div key={field} className={`space-y-1.5 ${field === 'title' || field === 'image' ? 'sm:col-span-2' : ''}`}>
                        <Label className="text-xs">{FIELD_LABELS[field] ?? field}</Label>
                        {field === 'image' ? (
                          <div className="space-y-1">
                            <Input
                              value={(config[field] as string) ?? ''}
                              onChange={(e) => updateField(sectionKey, field, e.target.value)}
                              placeholder="https://..."
                              className="text-sm"
                            />
                            {(config[field] as string) && (
                              <img src={config[field] as string} alt="" className="w-full h-20 object-cover rounded-lg" onError={(e) => (e.currentTarget.style.display = 'none')} />
                            )}
                          </div>
                        ) : field === 'subtitle' ? (
                          <Textarea
                            value={(config[field] as string) ?? ''}
                            onChange={(e) => updateField(sectionKey, field, e.target.value)}
                            placeholder={FIELD_LABELS[field]}
                            rows={2}
                            className="resize-none text-sm"
                          />
                        ) : (
                          <Input
                            value={(config[field] as string) ?? ''}
                            onChange={(e) => updateField(sectionKey, field, e.target.value)}
                            placeholder={FIELD_LABELS[field]}
                            className="text-sm"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => saveSection(sectionKey)}
                      disabled={isSaving}
                      className="bg-violet-600 hover:bg-violet-700 text-white h-8"
                    >
                      {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                      {isSaving ? 'Guardando...' : 'Guardar sección'}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
