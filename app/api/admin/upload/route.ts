import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

const BUCKET = 'catalog-images'

function adminStorageClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(request: NextRequest) {
  try {
    // Verificar auth con el cliente de sesión
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) ?? 'general'

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Solo se permiten JPG, PNG, WEBP.' }, { status: 400 })
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'El archivo es muy grande. Máximo 5MB.' }, { status: 400 })
    }

    // Cliente admin con service role key para storage (bypasea RLS)
    const admin = adminStorageClient()

    // Auto-crear el bucket si no existe
    const { data: buckets } = await admin.storage.listBuckets()
    if (!buckets?.some((b) => b.name === BUCKET)) {
      await admin.storage.createBucket(BUCKET, {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 5242880,
      })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { data, error } = await admin.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Storage error:', error)
      return NextResponse.json({ error: `Error al subir: ${error.message}` }, { status: 500 })
    }

    const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(data.path)

    return NextResponse.json({ url: publicUrl, path: data.path })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
