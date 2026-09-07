import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { deletePage, getPage, updatePage } from '@/lib/cms/content'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const page = await getPage(params.slug)
  if (!page) return NextResponse.json({ error: 'Page not found.' }, { status: 404 })

  return NextResponse.json({ page })
}

export async function PATCH(request, { params }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const existing = await getPage(params.slug)
  if (!existing) return NextResponse.json({ error: 'Page not found.' }, { status: 404 })

  try {
    const page = await updatePage(existing.id, body)
    return NextResponse.json({ page })
  } catch (err) {
    console.error('Update page error:', err)
    return NextResponse.json({ error: 'Failed to update page.' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await getPage(params.slug)
  if (!existing) return NextResponse.json({ error: 'Page not found.' }, { status: 404 })

  try {
    await deletePage(existing.id)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    if (err.code === 'PROTECTED_PAGE') return NextResponse.json({ error: err.message }, { status: 403 })
    if (err.code === 'PAGE_NOT_FOUND') return NextResponse.json({ error: err.message }, { status: 404 })
    console.error('Delete page error:', err)
    return NextResponse.json({ error: 'Failed to delete page.' }, { status: 500 })
  }
}
