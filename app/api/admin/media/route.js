import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { uploadMedia, listMedia } from '@/lib/cms/media'
import { readImageDimensions } from '@/lib/cms/image-dimensions'

export const dynamic = 'force-dynamic'

// ─── GET /api/admin/media — list assets ───────────────────────────────────────

export async function GET(request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page     = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const search   = searchParams.get('search') ?? ''
  const mimeType = searchParams.get('mimeType') ?? ''

  try {
    const result = await listMedia({ page, search, mimeType })
    return NextResponse.json(result)
  } catch (err) {
    console.error('Media list error:', err)
    return NextResponse.json({ error: 'Failed to list media.' }, { status: 500 })
  }
}

// ─── POST /api/admin/media — upload asset ─────────────────────────────────────

export async function POST(request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let formData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid multipart form data.' }, { status: 400 })
  }

  const file    = formData.get('file')
  const altText = formData.get('altText')?.toString() ?? ''

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
  }

  // Convert Web File to Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer      = Buffer.from(arrayBuffer)
  const mimeType    = file.type
  const filename    = file.name
  const sizeBytes   = buffer.length

  // Extract dimensions from buffer (server-side, not trusting client)
  const dims = readImageDimensions(buffer, mimeType)

  const result = await uploadMedia({
    buffer,
    filename,
    mimeType,
    sizeBytes,
    width:   dims?.width,
    height:  dims?.height,
    altText,
  })

  if (!result.success) {
    return NextResponse.json({ errors: result.errors }, { status: 422 })
  }

  return NextResponse.json({ asset: result.asset }, { status: 201 })
}
