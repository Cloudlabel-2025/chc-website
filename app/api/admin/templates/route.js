import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/cms/auth-helpers'
import { listTemplates, createTemplate } from '@/lib/cms/content'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await requireAdmin()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try { return NextResponse.json({ templates: await listTemplates() }) }
  catch (err) { console.error('List templates error:', err); return NextResponse.json({ error: 'Failed to list templates.' }, { status: 500 }) }
}

export async function POST(request) {
  const session = await requireAdmin()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let body
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 }) }
  try { return NextResponse.json({ template: await createTemplate(body ?? {}) }, { status: 201 }) }
  catch (err) { console.error('Create template error:', err); return NextResponse.json({ error: err.message || 'Failed to create template.' }, { status: 400 }) }
}
