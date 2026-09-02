import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { listPages, createPage } from '@/lib/cms/content'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const pages = await listPages()
    return NextResponse.json({ pages })
  } catch (err) {
    console.error('List pages error:', err)
    return NextResponse.json({ error: 'Failed to list pages.' }, { status: 500 })
  }
}

export async function POST(request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const { slug, title } = body ?? {}
  if (!slug || !title) {
    return NextResponse.json({ error: 'slug and title are required.' }, { status: 400 })
  }

  try {
    const page = await createPage({ slug, title })
    return NextResponse.json({ page }, { status: 201 })
  } catch (err) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: `Page with slug "${slug}" already exists.` }, { status: 409 })
    }
    console.error('Create page error:', err)
    return NextResponse.json({ error: 'Failed to create page.' }, { status: 500 })
  }
}
