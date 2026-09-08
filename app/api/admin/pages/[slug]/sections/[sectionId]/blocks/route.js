import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createRepeatableItem, upsertBlock, reorderBlocks } from '@/lib/cms/content'

export const dynamic = 'force-dynamic'

// POST — upsert a single block
export async function POST(request, { params }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const { fieldKey, blockType, textValue, mediaAssetId, sortOrder, parentId } = body ?? {}
  if (!fieldKey || !blockType) {
    return NextResponse.json({ error: 'fieldKey and blockType are required.' }, { status: 400 })
  }

  try {
    if (fieldKey === 'item' && !parentId) {
      const item = await createRepeatableItem({
        sectionId: params.sectionId,
        sortOrder,
      })
      return NextResponse.json({ block: item.parent, children: item.children }, { status: 201 })
    }

    const block = await upsertBlock({
      sectionId: params.sectionId,
      fieldKey,
      blockType,
      textValue,
      mediaAssetId,
      sortOrder,
      parentId,
    })
    return NextResponse.json({ block }, { status: 201 })
  } catch (err) {
    console.error('Upsert block error:', err)
    return NextResponse.json({ error: 'Failed to upsert block.' }, { status: 500 })
  }
}

// PATCH — reorder blocks
export async function PATCH(request, { params }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  if (!Array.isArray(body?.items)) {
    return NextResponse.json({ error: 'items array is required.' }, { status: 400 })
  }

  try {
    await reorderBlocks(body.items)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Reorder blocks error:', err)
    return NextResponse.json({ error: 'Failed to reorder blocks.' }, { status: 500 })
  }
}
