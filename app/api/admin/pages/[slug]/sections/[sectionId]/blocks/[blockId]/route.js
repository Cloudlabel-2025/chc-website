import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { setBlockPublished, deleteBlock } from '@/lib/cms/content'

export const dynamic = 'force-dynamic'

export async function PATCH(request, { params }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  if (body.isPublished === undefined) {
    return NextResponse.json({ error: 'isPublished is required.' }, { status: 400 })
  }

  try {
    const block = await setBlockPublished(params.blockId, body.isPublished)
    return NextResponse.json({ block })
  } catch (err) {
    console.error('Set block published error:', err)
    return NextResponse.json({ error: 'Failed to update block.' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await deleteBlock(params.blockId)
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Block not found.' }, { status: 404 })
    }
    console.error('Delete block error:', err)
    return NextResponse.json({ error: 'Failed to delete block.' }, { status: 500 })
  }
}
