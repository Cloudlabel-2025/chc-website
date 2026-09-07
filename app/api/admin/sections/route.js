import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/cms/auth-helpers'
import { upsertSection, reorderSections, populateSectionDefaults } from '@/lib/cms/content'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  const session = await requireAdmin()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const { pageId, sectionKey, animationKey } = body ?? {}
  if (!pageId || !sectionKey) {
    return NextResponse.json({ error: 'pageId and sectionKey are required.' }, { status: 400 })
  }

  try {
    const lastSection = await prisma.section.findFirst({
      where: { pageId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    })
    const sortOrder = (lastSection?.sortOrder ?? -1) + 1

    const section = await upsertSection({ pageId, sectionKey, sortOrder, animationKey })

    const fullSection = await populateSectionDefaults(section.id, sectionKey, session.user.id)

    return NextResponse.json({ section: fullSection }, { status: 201 })
  } catch (err) {
    console.error('Create section error:', err)
    return NextResponse.json({ error: 'Failed to create section.' }, { status: 500 })
  }
}

export async function PATCH(request) {
  const session = await requireAdmin()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const sections = body?.sections ?? body?.items
  if (!Array.isArray(sections)) {
    return NextResponse.json({ error: 'sections array is required.' }, { status: 400 })
  }

  try {
    await reorderSections(sections)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Reorder sections error:', err)
    return NextResponse.json({ error: 'Failed to reorder sections.' }, { status: 500 })
  }
}
