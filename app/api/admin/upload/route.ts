import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

const BUCKET = 'catalog-images'

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar sesión con el cliente normal (cookies)
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado. Iniciá sesión.' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) ?? 'general'

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Formato no permitido. Usá JPG, PNG o WEBP.' }, { status: 400 })
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'La imagen pesa más de 5MB.' }, { status: 400 })
    }

    // 2. Cliente admin con service role key (bypasea RLS completamente)
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) {
      return NextResponse.json({ error: 'Config: SUPABASE_SERVICE_ROLE_KEY no configurada en el servidor.' }, { status: 500 })
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // 3. Auto-crear el bucket si no existe
    const { data: buckets, error: listErr } = await admin.storage.listBuckets()
    if (listErr) {
      console.error('Error listando buckets:', listErr)
      return NextResponse.json({ error: `Error de Storage: ${listErr.message}` }, { status: 500 })
    }

    if (!buckets?.some((b) => b.name === BUCKET)) {
      const { error: createErr } = await admin.storage.createBucket(BUCKET, {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 5242880,
      })
      if (createErr && !createErr.message.includes('already exists')) {
        console.error('Error creando bucket:', createErr)
        return NextResponse.json({ error: `Error creando bucket: ${createErr.message}` }, { status: 500 })
      }
    }

    // 4. Subir el archivo
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { data, error: uploadErr } = await admin.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadErr) {
      console.error('Error subiendo archivo:', uploadErr)
      return NextResponse.json({ error: `Error al subir: ${uploadErr.message}` }, { status: 500 })
    }

    const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(data.path)

    return NextResponse.json({ url: publicUrl, path: data.path })
  } catch (err) {
    console.error('Error inesperado en upload:', err)
    return NextResponse.json({ error: `Error interno: ${err instanceof Error ? err.message : 'desconocido'}` }, { status: 500 })
  }
}
