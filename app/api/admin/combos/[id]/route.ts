import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { products: comboProducts, ...comboData } = body
    delete comboData.id; delete comboData.created_at; delete comboData.updated_at; delete comboData.combo_products

    const { data, error } = await supabase.from('combos').update(comboData).eq('id', id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (comboProducts !== undefined) {
      await supabase.from('combo_products').delete().eq('combo_id', id)
      if (comboProducts.length > 0) {
        await supabase.from('combo_products').insert(
          comboProducts.map((p: { product_id: string; quantity: number }) => ({
            combo_id: id, product_id: p.product_id, quantity: p.quantity,
          }))
        )
      }
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase.from('combos').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
