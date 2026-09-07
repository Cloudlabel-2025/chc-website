import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPage, populateSectionDefaults, setSectionVisibility } from '@/lib/cms/content'

export const dynamic = 'force-dynamic'

// Seeds an existing empty section. It never replaces existing blocks, so it is
// safe for sections created before default-content seeding was introduced.
export async function POST(_request, { params }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const page = await getPage(params.slug)
    const section = page?.sections?.find((entry) => entry.id === params.sectionId)
    if (!section) return NextResponse.json({ error: 'Section not found on this page.' }, { status: 404 })
    const populatedSection = await populateSectionDefaults(section.id, section.sectionKey, session.user.id)
    return NextResponse.json({ section: populatedSection })
  } catch (err) {
    console.error('Restore section defaults error:', err)
    return NextResponse.json({ error: 'Could not restore this section’s default content.' }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  if (body.isVisible === undefined) {
    return NextResponse.json({ error: 'isVisible is required.' }, { status: 400 })
  }

  try {
    const section = await setSectionVisibility(params.sectionId, body.isVisible)
    return NextResponse.json({ section })
  } catch (err) {
    console.error('Set section visibility error:', err)
    return NextResponse.json({ error: 'Failed to update section.' }, { status: 500 })
  }
}
