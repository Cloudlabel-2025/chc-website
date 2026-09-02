import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { listSubmissions, markSubmissionsRead, getSubmissionCounts } from '@/lib/cms/forms'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const page       = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const formType   = searchParams.get('formType') ?? ''
  const unreadOnly = searchParams.get('unreadOnly') === 'true'
  const counts     = searchParams.get('counts') === 'true'

  try {
    if (counts) {
      const data = await getSubmissionCounts()
      return NextResponse.json(data)
    }
    const result = await listSubmissions({ page, formType, unreadOnly })
    return NextResponse.json(result)
  } catch (err) {
    console.error('List submissions error:', err)
    return NextResponse.json({ error: 'Failed to list submissions.' }, { status: 500 })
  }
}

export async function PATCH(request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const { ids, isRead } = body ?? {}
  if (!Array.isArray(ids) || !ids.length) {
    return NextResponse.json({ error: 'ids array is required.' }, { status: 400 })
  }

  try {
    await markSubmissionsRead(ids, isRead ?? true)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Mark read error:', err)
    return NextResponse.json({ error: 'Failed to update submissions.' }, { status: 500 })
  }
}
