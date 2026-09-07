import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPage, upsertSection, populateSectionDefaults } from '@/lib/cms/content'

export const dynamic = 'force-dynamic'

export async function POST(request, { params }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const page = await getPage(params.slug)
  if (!page) return NextResponse.json({ error: 'Page not found.' }, { status: 404 })

  const { sectionKey, sortOrder } = body ?? {}
  if (!sectionKey) return NextResponse.json({ error: 'sectionKey is required.' }, { status: 400 })

  try {
    const section = await upsertSection({ pageId: page.id, sectionKey, sortOrder })
    const populatedSection = await populateSectionDefaults(section.id, sectionKey, session.user.id)
    return NextResponse.json({ section: populatedSection }, { status: 201 })
  } catch (err) {
    console.error('Upsert section error:', err)
    return NextResponse.json({ error: 'Failed to upsert section.' }, { status: 500 })
  }
}
