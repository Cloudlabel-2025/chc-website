import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { listSeo } from '@/lib/cms/seo'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const seoList = await listSeo()
    return NextResponse.json({ seoList })
  } catch (err) {
    console.error('List SEO error:', err)
    return NextResponse.json({ error: 'Failed to list SEO meta.' }, { status: 500 })
  }
}
