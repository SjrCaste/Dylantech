'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Upload, X, Star, GripVertical, Loader2, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { ProductImage } from '@/lib/types/admin'

interface ImageUploaderProps {
  images: ProductImage[]
  onChange: (images: ProductImage[]) => void
  maxImages?: number
}

function SortableImage({
  image,
  onRemove,
  onSetPrimary,
}: {
  image: ProductImage & { id: string }
  onRemove: () => void
  onSetPrimary: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative w-24 h-24 rounded-xl overflow-hidden border-2 group bg-zinc-100 dark:bg-zinc-800 shrink-0',
        image.is_primary ? 'border-violet-500' : 'border-zinc-200 dark:border-zinc-700',
        isDragging && 'opacity-50'
      )}
    >
      <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 w-5 h-5 bg-black/50 rounded flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-3 h-3 text-white" />
      </div>

      {/* Primary badge */}
      {image.is_primary && (
        <div className="absolute bottom-1 left-1 bg-violet-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
          Principal
        </div>
      )}

      {/* Hover actions */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
        {!image.is_primary && (
          <button
            type="button"
            onClick={onSetPrimary}
            className="w-7 h-7 bg-violet-600 rounded-full flex items-center justify-center hover:bg-violet-700 transition-colors"
            title="Imagen principal"
          >
            <Star className="w-3.5 h-3.5 text-white" />
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
          title="Eliminar imagen"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  )
}

export function ImageUploader({ images, onChange, maxImages = 8 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const imagesWithIds = images.map((img, i) => ({ ...img, id: img.url || `img-${i}` }))

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxImages) {
        toast.error(`Máximo ${maxImages} imágenes permitidas`)
        return
      }

      setUploading(true)
      const uploaded: ProductImage[] = []

      for (const file of acceptedFiles) {
        try {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('folder', 'products')

          const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
          const data = await res.json()

          if (data.url) {
            uploaded.push({
              url: data.url,
              alt: file.name.replace(/\.[^/.]+$/, ''),
              is_primary: images.length === 0 && uploaded.length === 0,
              order: images.length + uploaded.length,
            })
          } else {
            toast.error(data.error ?? `Error subiendo ${file.name}`)
          }
        } catch (err) {
          toast.error(`Error de red al subir ${file.name}`)
          console.error(err)
        }
      }

      if (uploaded.length > 0) {
        onChange([...images, ...uploaded])
        toast.success(`${uploaded.length} imagen${uploaded.length !== 1 ? 'es' : ''} subida${uploaded.length !== 1 ? 's' : ''}`)
      }
      setUploading(false)
    },
    [images, maxImages, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    multiple: true,
    disabled: uploading || images.length >= maxImages,
  })

  function handleRemove(index: number) {
    const newImages = images.filter((_, i) => i !== index)
    if (newImages.length > 0 && !newImages.some((img) => img.is_primary)) {
      newImages[0] = { ...newImages[0], is_primary: true }
    }
    onChange(newImages)
  }

  function handleSetPrimary(index: number) {
    onChange(
      images.map((img, i) => ({ ...img, is_primary: i === index }))
    )
  }

  function handleDragEnd(event: any) {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = imagesWithIds.findIndex((img) => img.id === active.id)
      const newIndex = imagesWithIds.findIndex((img) => img.id === over.id)
      const newImages = arrayMove(images, oldIndex, newIndex).map((img, i) => ({ ...img, order: i }))
      onChange(newImages)
    }
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/20'
            : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 bg-zinc-50 dark:bg-zinc-900/50',
          (uploading || images.length >= maxImages) && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            <p className="text-sm text-zinc-500">Subiendo imágenes...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <Upload className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {isDragActive ? 'Soltá las imágenes aquí' : 'Arrastrá o hacé click para subir'}
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">JPG, PNG, WEBP · Máx {maxImages} imágenes</p>
            </div>
          </div>
        )}
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={imagesWithIds.map((img) => img.id)} strategy={horizontalListSortingStrategy}>
            <div className="flex flex-wrap gap-2">
              {imagesWithIds.map((image, index) => (
                <SortableImage
                  key={image.id}
                  image={image}
                  onRemove={() => handleRemove(index)}
                  onSetPrimary={() => handleSetPrimary(index)}
                />
              ))}
              {images.length < maxImages && !uploading && (
                <div
                  {...getRootProps()}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex items-center justify-center cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors shrink-0"
                >
                  <input {...getInputProps()} />
                  <ImageIcon className="w-5 h-5 text-zinc-300" />
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {images.length > 0 && (
        <p className="text-xs text-zinc-400">
          {images.length}/{maxImages} imágenes · Arrastrá para reordenar · La estrella marca la imagen principal
        </p>
      )}
    </div>
  )
}
