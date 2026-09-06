import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/cms/auth-helpers'
import { applyTemplate } from '@/lib/cms/content'

export const dynamic = 'force-dynamic'

export async function POST(request, { params }) {
  const session = await requireAdmin()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let body
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 }) }
  if (!body?.pageId) return NextResponse.json({ error: 'pageId is required.' }, { status: 400 })
  try { return NextResponse.json({ page: await applyTemplate(params.id, body.pageId) }) }
  catch (err) { console.error('Apply template error:', err); return NextResponse.json({ error: err.message || 'Failed to apply template.' }, { status: 400 }) }
}
