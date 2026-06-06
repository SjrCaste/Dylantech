import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase.from('settings').select('*')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const settings: Record<string, unknown> = {}
    for (const row of data ?? []) {
      settings[row.key] = typeof row.value === 'string' ? row.value.replace(/^"|"$/g, '') : row.value
    }
    return NextResponse.json({ data: settings })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()

    const upserts = Object.entries(body).map(([key, value]) => ({
      key,
      value: typeof value === 'string' ? `"${value}"` : JSON.stringify(value),
    }))

    const { error } = await supabase
      .from('settings')
      .upsert(upserts, { onConflict: 'key' })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('activity_log').insert({
      user_id: user.id, user_email: user.email,
      action: 'update', resource_type: 'settings', resource_name: 'General settings',
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
