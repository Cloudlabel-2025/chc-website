import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getFooter, updateFooter } from '@/lib/cms/footer'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const footer = await getFooter()
    return NextResponse.json({ footer })
  } catch (err) {
    console.error('Get footer error:', err)
    return NextResponse.json({ error: 'Failed to get footer.' }, { status: 500 })
  }
}

export async function PUT(request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const result = await updateFooter(body ?? {})
  if (!result.success) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ footer: result.footer })
}
