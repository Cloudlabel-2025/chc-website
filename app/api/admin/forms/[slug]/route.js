import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/cms/auth-helpers'
import { getFormDefinition, updateFormDefinition, deleteFormDefinition } from '@/lib/cms/form-definitions'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  const session = await requireAdmin()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const form = await getFormDefinition(params.slug)
  if (!form) return NextResponse.json({ error: 'Form not found.' }, { status: 404 })
  return NextResponse.json({ form })
}

export async function PATCH(request, { params }) {
  const session = await requireAdmin()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let body
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 }) }
  try {
    const form = await updateFormDefinition(params.slug, body)
    return NextResponse.json({ form })
  } catch (err) {
    if (err.message?.includes('not found')) return NextResponse.json({ error: 'Form not found.' }, { status: 404 })
    console.error('Update form error:', err)
    return NextResponse.json({ error: err.message || 'Failed to update form.' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await deleteFormDefinition(params.slug)
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err.message?.includes('not found')) return NextResponse.json({ error: 'Form not found.' }, { status: 404 })
    if (err.message?.includes('submission')) return NextResponse.json({ error: err.message }, { status: 409 })
    console.error('Delete form error:', err)
    return NextResponse.json({ error: 'Failed to delete form.' }, { status: 500 })
  }
}
