import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/cms/auth-helpers'
import { setSectionVisibility, deleteSection } from '@/lib/cms/content'

export const dynamic = 'force-dynamic'

export async function PATCH(request, { params }) {
  const session = await requireAdmin()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  try {
    const section = await setSectionVisibility(params.id, Boolean(body.isVisible))
    return NextResponse.json({ section })
  } catch (err) {
    console.error('Update section error:', err)
    return NextResponse.json({ error: 'Failed to update section.' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await deleteSection(params.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Section not found.' }, { status: 404 })
    console.error('Delete section error:', err)
    return NextResponse.json({ error: 'Failed to delete section.' }, { status: 500 })
  }
}
