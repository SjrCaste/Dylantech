import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [
      { count: total_products },
      { count: total_categories },
      { count: total_combos },
      { count: featured_products },
      { count: out_of_stock },
      { count: new_products },
      { count: on_sale },
      { data: recent_products },
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('combos').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_featured', true),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'out_of_stock'),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_new', true),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_on_sale', true),
      supabase.from('products')
        .select('id, name, price, status, images, created_at, category:categories(name)')
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    return NextResponse.json({
      total_products: total_products ?? 0,
      total_categories: total_categories ?? 0,
      total_combos: total_combos ?? 0,
      featured_products: featured_products ?? 0,
      out_of_stock: out_of_stock ?? 0,
      new_products: new_products ?? 0,
      on_sale: on_sale ?? 0,
      recent_products: recent_products ?? [],
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
