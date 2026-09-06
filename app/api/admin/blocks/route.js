import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/cms/auth-helpers'
import { upsertBlock, reorderBlocks } from '@/lib/cms/content'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  const session = await requireAdmin()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  try {
    const block = await upsertBlock(body)
    return NextResponse.json({ block }, { status: 201 })
  } catch (err) {
    console.error('Upsert block error:', err)
    return NextResponse.json({ error: err.message || 'Failed to save content block.' }, { status: 422 })
  }
}

export async function PATCH(request) {
  const session = await requireAdmin()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const blocks = body?.blocks ?? body?.items
  if (!Array.isArray(blocks)) {
    return NextResponse.json({ error: 'blocks array is required.' }, { status: 400 })
  }

  try {
    await reorderBlocks(blocks)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Reorder blocks error:', err)
    return NextResponse.json({ error: 'Failed to reorder blocks.' }, { status: 500 })
  }
}
