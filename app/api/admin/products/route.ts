import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') ?? ''
    const category = searchParams.get('category') ?? ''
    const status = searchParams.get('status') ?? ''
    const featured = searchParams.get('featured') ?? ''
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '50')
    const offset = (page - 1) * limit

    let query = supabase
      .from('products')
      .select('*, category:categories(id, name), subcategory:subcategories(id, name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (q) query = query.or(`name.ilike.%${q}%,sku.ilike.%${q}%,short_description.ilike.%${q}%`)
    if (category) query = query.eq('category_id', category)
    if (status) query = query.eq('status', status)
    if (featured === 'true') query = query.eq('is_featured', true)

    const { data, error, count } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ data, count, page, limit })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()

    const { data, error } = await supabase
      .from('products')
      .insert(body)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('activity_log').insert({
      user_id: user.id,
      user_email: user.email,
      action: 'create',
      resource_type: 'product',
      resource_id: data.id,
      resource_name: data.name,
    })

    revalidatePath('/')
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
