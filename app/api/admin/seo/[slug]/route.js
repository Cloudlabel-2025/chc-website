import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getSeo, updateSeo } from '@/lib/cms/seo'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const seo = await getSeo(params.slug)
    return NextResponse.json({ seo })
  } catch (err) {
    console.error('Get SEO error:', err)
    return NextResponse.json({ error: 'Failed to get SEO meta.' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const result = await updateSeo(params.slug, body ?? {})
  if (!result.success) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }
  return NextResponse.json({ seo: result.seo })
}
