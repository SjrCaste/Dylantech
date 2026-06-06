import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

const BUCKET = 'catalog-images'

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar sesión via cookies
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

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) {
      return NextResponse.json({ error: 'Config: SUPABASE_SERVICE_ROLE_KEY no configurada en el servidor.' }, { status: 500 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const storageUrl = `${supabaseUrl}/storage/v1`

    // Llamadas directas a la REST API de Supabase Storage — evita el parsing JWT del SDK
    const authHeaders: Record<string, string> = {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
    }

    // 2. Crear bucket si no existe (ignorar error "already exists")
    await fetch(`${storageUrl}/bucket`, {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: BUCKET,
        name: BUCKET,
        public: true,
        allowed_mime_types: ['image/*'],
        file_size_limit: 5242880,
      }),
    })

    // 3. Subir archivo via REST
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const uploadRes = await fetch(`${storageUrl}/object/${BUCKET}/${fileName}`, {
      method: 'POST',
      headers: {
        ...authHeaders,
        'Content-Type': file.type,
        'Cache-Control': '3600',
      },
      body: buffer,
    })

    if (!uploadRes.ok) {
      const errData = await uploadRes.json().catch(() => ({ message: uploadRes.statusText }))
      console.error('Storage upload error:', errData)
      return NextResponse.json(
        { error: `Error al subir: ${errData.message ?? errData.error ?? uploadRes.statusText}` },
        { status: 500 }
      )
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${fileName}`
    return NextResponse.json({ url: publicUrl, path: fileName })
  } catch (err) {
    console.error('Error inesperado en upload:', err)
    return NextResponse.json(
      { error: `Error interno: ${err instanceof Error ? err.message : 'desconocido'}` },
      { status: 500 }
    )
  }
}
