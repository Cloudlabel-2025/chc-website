import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getMedia, deleteMedia, updateMediaAlt } from '@/lib/cms/media'

export const dynamic = 'force-dynamic'

// ─── GET /api/admin/media/[id] — get single asset ────────────────────────────

export async function GET(request, { params }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const result = await getMedia(id)

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 404 })
  }

  return NextResponse.json({ asset: result.asset })
}

// ─── PATCH /api/admin/media/[id] — update alt text ───────────────────────────

export async function PATCH(request, { params }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const altText = body?.altText
  if (typeof altText !== 'string') {
    return NextResponse.json({ error: 'altText must be a string.' }, { status: 400 })
  }

  const result = await updateMediaAlt(id, altText)

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json({ asset: result.asset })
}

// ─── DELETE /api/admin/media/[id] — delete asset ─────────────────────────────

export async function DELETE(request, { params }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { searchParams } = new URL(request.url)
  const force = searchParams.get('force') === 'true'

  const result = await deleteMedia(id, { force })

  if (!result.success) {
    // 409 Conflict when referenced, 404 when not found, 500 for storage errors
    const status = result.references ? 409 : result.error === 'Asset not found.' ? 404 : 500
    return NextResponse.json(
      { error: result.error, references: result.references ?? 0 },
      { status }
    )
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
