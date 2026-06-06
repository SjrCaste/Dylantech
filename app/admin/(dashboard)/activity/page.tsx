'use client'

import { useEffect, useState } from 'react'
import { Activity, Package, FolderOpen, Layers, Image, Settings, Tag, Plus, Edit, Trash2, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateTime } from '@/lib/utils/slugify'
import type { ActivityLog } from '@/lib/types/admin'

const RESOURCE_ICONS: Record<string, React.ElementType> = {
  product: Package,
  category: FolderOpen,
  combo: Layers,
  banner: Image,
  settings: Settings,
  testimonial: Tag,
  faq: Tag,
}

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  update: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  delete: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
}

const ACTION_LABELS: Record<string, string> = {
  create: 'Creó',
  update: 'Actualizó',
  delete: 'Eliminó',
}

const ACTION_ICONS: Record<string, React.ElementType> = {
  create: Plus,
  update: Edit,
  delete: Trash2,
}

export default function ActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchLogs() {
    setLoading(true)
    const res = await fetch('/api/admin/activity?limit=100')
    const json = await res.json()
    setLogs(json.data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchLogs() }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Registro de Actividad</h1>
          <p className="text-sm text-zinc-400 mt-0.5">Historial de cambios realizados en el panel</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-56" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
            <Activity className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No hay actividad registrada aún</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {logs.map((log) => {
              const ResourceIcon = RESOURCE_ICONS[log.resource_type] ?? Tag
              const ActionIcon = ACTION_ICONS[log.action] ?? Edit
              return (
                <div key={log.id} className="flex items-center gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <ResourceIcon className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-900 dark:text-zinc-100">
                      <span className="font-medium">{log.user_email ?? 'Admin'}</span>
                      {' '}{ACTION_LABELS[log.action] ?? log.action}{' '}
                      <span className="font-medium">{log.resource_type}</span>
                      {log.resource_name && (
                        <span className="text-zinc-500"> "{log.resource_name}"</span>
                      )}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">{formatDateTime(log.created_at)}</p>
                  </div>
                  <Badge className={`text-[10px] shrink-0 border-0 ${ACTION_COLORS[log.action] ?? 'bg-zinc-100 text-zinc-600'}`}>
                    <ActionIcon className="w-2.5 h-2.5 mr-1" />
                    {ACTION_LABELS[log.action] ?? log.action}
                  </Badge>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
