import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('combos')
      .select('*, combo_products(id, quantity, product:products(id, name, price, images))')
      .order('display_order')

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { products: comboProducts, ...comboData } = body

    const { data: combo, error } = await supabase.from('combos').insert(comboData).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (comboProducts?.length > 0) {
      await supabase.from('combo_products').insert(
        comboProducts.map((p: { product_id: string; quantity: number }) => ({
          combo_id: combo.id,
          product_id: p.product_id,
          quantity: p.quantity,
        }))
      )
    }

    await supabase.from('activity_log').insert({
      user_id: user.id, user_email: user.email,
      action: 'create', resource_type: 'combo', resource_id: combo.id, resource_name: combo.name,
    })

    return NextResponse.json({ data: combo })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
