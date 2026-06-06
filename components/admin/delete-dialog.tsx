'use client'

import { useState } from 'react'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertTriangle, Loader2 } from 'lucide-react'

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  title: string
  description: string
  confirmText?: string
  requireTyping?: string
}

export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = 'Eliminar',
  requireTyping,
}: DeleteDialogProps) {
  const [loading, setLoading] = useState(false)
  const [typed, setTyped] = useState('')

  const canConfirm = !requireTyping || typed === requireTyping

  async function handleConfirm() {
    if (!canConfirm) return
    setLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
      setTyped('')
    } finally {
      setLoading(false)
    }
  }

  function handleOpenChange(open: boolean) {
    if (!loading) {
      onOpenChange(open)
      if (!open) setTyped('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-base">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        {requireTyping && (
          <div className="space-y-2">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Escribí{' '}
              <code className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-red-600">
                {requireTyping}
              </code>{' '}
              para confirmar:
            </p>
            <Input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={requireTyping}
              className="font-mono"
              disabled={loading}
            />
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading || !canConfirm}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Eliminando...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
