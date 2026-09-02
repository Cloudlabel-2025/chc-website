import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { updateNavItem, deleteNavItem } from '@/lib/cms/navigation'

export const dynamic = 'force-dynamic'

export async function PATCH(request, { params }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const result = await updateNavItem(params.id, body ?? {})
  if (!result.success) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ item: result.item })
}

export async function DELETE(request, { params }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await deleteNavItem(params.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Nav item not found.' }, { status: 404 })
    }
    console.error('Delete nav item error:', err)
    return NextResponse.json({ error: 'Failed to delete nav item.' }, { status: 500 })
  }
}
