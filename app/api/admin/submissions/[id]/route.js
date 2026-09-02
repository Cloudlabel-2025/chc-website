import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getSubmission, deleteSubmission } from '@/lib/cms/forms'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const result = await getSubmission(params.id)
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 404 })

  return NextResponse.json({ submission: result.submission })
}

export async function DELETE(request, { params }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await deleteSubmission(params.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Submission not found.' }, { status: 404 })
    }
    console.error('Delete submission error:', err)
    return NextResponse.json({ error: 'Failed to delete submission.' }, { status: 500 })
  }
}
