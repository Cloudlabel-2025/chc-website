import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/cms/auth-helpers'
import { setBlockPublished, deleteBlock } from '@/lib/cms/content'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function PATCH(request, { params }) {
  const session = await requireAdmin()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  try {
    if (body.isPublished !== undefined) {
      const block = await setBlockPublished(params.id, Boolean(body.isPublished))
      return NextResponse.json({ block })
    }

    const updateData = { updatedById: session.user.id }
    if (body.textValue !== undefined) updateData.textValue = body.textValue
    if (body.mediaAssetId !== undefined) updateData.mediaAssetId = body.mediaAssetId
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder

    const block = await prisma.contentBlock.update({
      where: { id: params.id },
      data: updateData,
      include: { mediaAsset: true },
    })

    return NextResponse.json({ block })
  } catch (err) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Block not found.' }, { status: 404 })
    console.error('Update block error:', err)
    return NextResponse.json({ error: 'Failed to update block.' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await deleteBlock(params.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Block not found.' }, { status: 404 })
    console.error('Delete block error:', err)
    return NextResponse.json({ error: 'Failed to delete block.' }, { status: 500 })
  }
}
