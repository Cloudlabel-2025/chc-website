import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { listNavItems, createNavItem, reorderNavItems } from '@/lib/cms/navigation'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const items = await listNavItems()
    return NextResponse.json({ items })
  } catch (err) {
    console.error('List nav error:', err)
    return NextResponse.json({ error: 'Failed to list navigation.' }, { status: 500 })
  }
}

export async function POST(request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const result = await createNavItem(body ?? {})
  if (!result.success) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ item: result.item }, { status: 201 })
}

export async function PATCH(request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  if (!Array.isArray(body?.items)) {
    return NextResponse.json({ error: 'items array is required.' }, { status: 400 })
  }

  try {
    await reorderNavItems(body.items)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Reorder nav error:', err)
    return NextResponse.json({ error: 'Failed to reorder navigation.' }, { status: 500 })
  }
}
