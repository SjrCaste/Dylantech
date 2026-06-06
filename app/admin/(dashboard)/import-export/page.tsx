'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Download, Upload, FileText, Package, FolderOpen, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'

interface ImportResult {
  success: boolean
  results: {
    created: number
    updated: number
    errors: number
    messages: string[]
  }
}

export default function ImportExportPage() {
  const [exportType, setExportType] = useState('products')
  const [importType, setImportType] = useState('products')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleExport() {
    window.open(`/api/admin/export?type=${exportType}`, '_blank')
    toast.success('Descarga iniciada')
  }

  async function handleImport(file: File) {
    if (!file.name.endsWith('.csv')) {
      toast.error('Solo se aceptan archivos CSV')
      return
    }

    setImporting(true)
    setImportResult(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', importType)

    try {
      const res = await fetch('/api/admin/import', { method: 'POST', body: formData })
      const data: ImportResult = await res.json()

      setImportResult(data)

      if (data.success) {
        const { created, updated, errors } = data.results
        if (errors === 0) {
          toast.success(`Importación completada: ${created} creados, ${updated} actualizados`)
        } else {
          toast.warning(`Importación con errores: ${created} creados, ${updated} actualizados, ${errors} errores`)
        }
      } else {
        toast.error('Error en la importación')
      }
    } catch {
      toast.error('Error al importar el archivo')
    } finally {
      setImporting(false)
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleImport(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImport(file)
  }

  const card = (children: React.ReactNode, className = '') => (
    <div className={`bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 ${className}`}>
      {children}
    </div>
  )

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Importar y Exportar</h1>
        <p className="text-sm text-zinc-400 mt-0.5">Gestioná tu catálogo masivamente con archivos CSV</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export */}
        {card(
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center">
                <Download className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Exportar datos</h2>
                <p className="text-xs text-zinc-400">Descargá tu catálogo como CSV</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">¿Qué querés exportar?</Label>
              <Select value={exportType} onValueChange={setExportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="products">
                    <div className="flex items-center gap-2"><Package className="w-3.5 h-3.5" /> Productos</div>
                  </SelectItem>
                  <SelectItem value="categories">
                    <div className="flex items-center gap-2"><FolderOpen className="w-3.5 h-3.5" /> Categorías</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                El archivo CSV incluirá todos los campos del catálogo. Podés abrirlo en Excel, Google Sheets u otras herramientas.
              </p>
            </div>

            <Button onClick={handleExport} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Descargar CSV
            </Button>
          </div>
        )}

        {/* Import */}
        {card(
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center">
                <Upload className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Importar datos</h2>
                <p className="text-xs text-zinc-400">Actualizá masivamente tu catálogo</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">¿Qué querés importar?</Label>
              <Select value={importType} onValueChange={setImportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="products">
                    <div className="flex items-center gap-2"><Package className="w-3.5 h-3.5" /> Productos</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/20'
                  : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
              } ${importing ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <input ref={fileInputRef} type="file" accept=".csv" onChange={onFileChange} className="hidden" />
              {importing ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                  <p className="text-sm text-zinc-500">Procesando archivo...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="w-8 h-8 text-zinc-300" />
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {dragOver ? 'Soltá el archivo aquí' : 'Arrastrá o hacé click para subir'}
                  </p>
                  <p className="text-xs text-zinc-400">Solo archivos .CSV</p>
                </div>
              )}
            </div>

            {/* Import result */}
            {importResult && (
              <div className={`p-4 rounded-xl border ${
                importResult.results.errors === 0
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
              }`}>
                <div className="flex items-start gap-2">
                  {importResult.results.errors === 0
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    : <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Resultado de la importación</p>
                    <div className="flex gap-4 mt-1">
                      <span className="text-xs text-emerald-700 dark:text-emerald-400">+{importResult.results.created} creados</span>
                      <span className="text-xs text-blue-700 dark:text-blue-400">↑{importResult.results.updated} actualizados</span>
                      {importResult.results.errors > 0 && (
                        <span className="text-xs text-red-600 dark:text-red-400">✗{importResult.results.errors} errores</span>
                      )}
                    </div>
                    {importResult.results.messages.length > 0 && (
                      <div className="mt-2 max-h-20 overflow-y-auto space-y-0.5">
                        {importResult.results.messages.slice(0, 5).map((msg, i) => (
                          <p key={i} className="text-[10px] text-red-600 dark:text-red-400">{msg}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      {card(
        <div className="space-y-4">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-400" />
            Formato del CSV para importación de productos
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                  {['Columna', 'Tipo', 'Descripción', 'Ejemplo'].map((h) => (
                    <th key={h} className="text-left px-3 py-2 font-semibold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['name', 'Texto', 'Nombre del producto (requerido)', 'Auriculares Bluetooth Pro'],
                  ['slug', 'Texto', 'URL amigable (auto-generado si vacío)', 'auriculares-bluetooth-pro'],
                  ['short_description', 'Texto', 'Descripción corta', 'Los mejores auriculares'],
                  ['price', 'Número', 'Precio del producto', '15000'],
                  ['promotional_price', 'Número', 'Precio con descuento', '12000'],
                  ['sku', 'Texto', 'Código de producto', 'SKU-001'],
                  ['stock', 'Número', 'Cantidad en stock', '50'],
                  ['status', 'available/out_of_stock', 'Estado del producto', 'available'],
                  ['tags', 'Texto', 'Etiquetas separadas por comas', 'wireless, premium'],
                  ['is_featured', 'true/false', 'Producto destacado', 'false'],
                  ['is_new', 'true/false', 'Nuevo ingreso', 'true'],
                  ['is_on_sale', 'true/false', 'En oferta', 'false'],
                  ['id', 'UUID', 'ID del producto (para actualizar)', '550e8400-...'],
                ].map(([col, type, desc, ex]) => (
                  <tr key={col} className="border border-zinc-200 dark:border-zinc-700">
                    <td className="px-3 py-2 font-mono text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20">{col}</td>
                    <td className="px-3 py-2 text-zinc-500">{type}</td>
                    <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">{desc}</td>
                    <td className="px-3 py-2 text-zinc-500 italic">{ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-400">
            💡 Tip: Exportá primero tus productos para obtener el formato correcto del CSV, luego editalo y reimportalo.
          </p>
        </div>
      )}
    </div>
  )
}
