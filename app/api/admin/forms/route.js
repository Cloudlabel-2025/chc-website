import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/cms/auth-helpers'
import { listFormDefinitions, createFormDefinition } from '@/lib/cms/form-definitions'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await requireAdmin()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const forms = await listFormDefinitions()
    return NextResponse.json({ forms })
  } catch (err) {
    console.error('List forms error:', err)
    return NextResponse.json({ error: 'Failed to list forms.' }, { status: 500 })
  }
}

export async function POST(request) {
  const session = await requireAdmin()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let body
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 }) }
  if (!body?.slug || !body?.title) return NextResponse.json({ error: 'slug and title are required.' }, { status: 400 })
  if (!Array.isArray(body.fields)) return NextResponse.json({ error: 'fields must be an array.' }, { status: 400 })
  // Basic slug validation
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug)) return NextResponse.json({ error: 'Invalid slug format (lowercase, hyphen-separated).' }, { status: 400 })
  try {
    const form = await createFormDefinition(body)
    return NextResponse.json({ form }, { status: 201 })
  } catch (err) {
    if (err.code === 'P2002') return NextResponse.json({ error: 'A form with this slug already exists.' }, { status: 409 })
    console.error('Create form error:', err)
    return NextResponse.json({ error: err.message || 'Failed to create form.' }, { status: 500 })
  }
}
