import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

function objectsToCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return ''

  const flattenObject = (obj: Record<string, unknown>, prefix = ''): Record<string, string> => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(acc, flattenObject(value as Record<string, unknown>, newKey))
      } else if (Array.isArray(value)) {
        acc[newKey] = value.join(', ')
      } else {
        acc[newKey] = String(value ?? '')
      }
      return acc
    }, {} as Record<string, string>)
  }

  const flatData = data.map((row) => flattenObject(row as Record<string, unknown>))
  const headers = Object.keys(flatData[0])
  const csvRows = [
    headers.join(','),
    ...flatData.map((row) =>
      headers.map((h) => {
        const val = row[h] ?? ''
        return val.includes(',') || val.includes('"') || val.includes('\n')
          ? `"${val.replace(/"/g, '""')}"`
          : val
      }).join(',')
    ),
  ]
  return csvRows.join('\n')
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') ?? 'products'
    const format = searchParams.get('format') ?? 'csv'

    let data: Record<string, unknown>[] = []
    let filename = ''

    if (type === 'products') {
      const { data: products } = await supabase
        .from('products')
        .select('id, name, slug, short_description, price, promotional_price, sku, stock, status, tags, is_featured, is_new, is_on_sale, created_at, category:categories(name), subcategory:subcategories(name)')
        .order('name')

      data = (products ?? []).map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        short_description: p.short_description ?? '',
        category: p.category?.name ?? '',
        subcategory: p.subcategory?.name ?? '',
        price: p.price,
        promotional_price: p.promotional_price ?? '',
        sku: p.sku ?? '',
        stock: p.stock,
        status: p.status,
        tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
        is_featured: p.is_featured,
        is_new: p.is_new,
        is_on_sale: p.is_on_sale,
        created_at: p.created_at,
      }))
      filename = `productos-${new Date().toISOString().split('T')[0]}`
    } else if (type === 'categories') {
      const { data: categories } = await supabase.from('categories').select('*').order('name')
      data = (categories ?? []) as Record<string, unknown>[]
      filename = `categorias-${new Date().toISOString().split('T')[0]}`
    }

    const csv = objectsToCSV(data)
    const bytes = Buffer.from('﻿' + csv, 'utf8')

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}.csv"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
