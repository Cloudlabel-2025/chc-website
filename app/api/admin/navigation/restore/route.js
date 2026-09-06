import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/cms/auth-helpers'
import { restoreDefaultNavigation } from '@/lib/cms/navigation'

export const dynamic = 'force-dynamic'

export async function POST() {
  const session = await requireAdmin()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const created = await restoreDefaultNavigation(session.user.id)
    return NextResponse.json({ created })
  } catch (err) {
    console.error('Restore navigation error:', err)
    return NextResponse.json({ error: 'Failed to restore navigation.' }, { status: 500 })
  }
}
