import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import Papa from 'papaparse'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = (formData.get('type') as string) ?? 'products'

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const text = await file.text()
    const { data: rows, errors } = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
    })

    if (errors.length > 0) {
      return NextResponse.json({ error: 'Error al parsear el CSV', details: errors }, { status: 400 })
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: 'El archivo está vacío' }, { status: 400 })
    }

    const results = { created: 0, updated: 0, errors: 0, messages: [] as string[] }

    if (type === 'products') {
      for (const row of rows) {
        try {
          const productData = {
            name: row.name?.trim(),
            slug: row.slug?.trim() || row.name?.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            short_description: row.short_description?.trim() || null,
            price: parseFloat(row.price) || 0,
            promotional_price: row.promotional_price ? parseFloat(row.promotional_price) : null,
            sku: row.sku?.trim() || null,
            stock: parseInt(row.stock) || 0,
            status: (row.status === 'out_of_stock' ? 'out_of_stock' : 'available') as 'available' | 'out_of_stock',
            tags: row.tags ? row.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
            is_featured: row.is_featured?.toLowerCase() === 'true',
            is_new: row.is_new?.toLowerCase() === 'true',
            is_on_sale: row.is_on_sale?.toLowerCase() === 'true',
          }

          if (!productData.name) {
            results.errors++
            results.messages.push(`Fila sin nombre: ${JSON.stringify(row)}`)
            continue
          }

          if (row.id) {
            const { error } = await supabase.from('products').update(productData).eq('id', row.id)
            if (error) { results.errors++; results.messages.push(`Error actualizando ${row.name}: ${error.message}`) }
            else results.updated++
          } else {
            const { error } = await supabase.from('products').insert(productData)
            if (error) { results.errors++; results.messages.push(`Error creando ${row.name}: ${error.message}`) }
            else results.created++
          }
        } catch (err) {
          results.errors++
          results.messages.push(`Error procesando fila: ${err}`)
        }
      }
    }

    await supabase.from('activity_log').insert({
      user_id: user.id, user_email: user.email,
      action: 'import', resource_type: type,
      resource_name: `${rows.length} registros`,
      details: { created: results.created, updated: results.updated, errors: results.errors },
    })

    return NextResponse.json({ success: true, results })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
