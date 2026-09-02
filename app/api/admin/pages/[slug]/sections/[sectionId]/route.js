import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { setSectionVisibility } from '@/lib/cms/content'

export const dynamic = 'force-dynamic'

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
