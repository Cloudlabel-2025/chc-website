/**
 * CHC CMS — Media Library Actions
 *
 * All functions are server-only. Every entry point calls requireAdmin()
 * before touching the DB or storage.
 *
 * Upload flow:
 *   1. requireAdmin()
 *   2. Validate MIME, extension, size, dimensions (validateMediaUpload)
 *   3. Upload buffer to S3 (uploadFile)
 *   4. Insert MediaAsset record in DB
 *   5. Write AuditLog
 *
 * Delete flow:
 *   1. requireAdmin()
 *   2. Check no ContentBlock references the asset (block or warn)
 *   3. Delete from S3
 *   4. Delete DB record
 *   5. Write AuditLog
 */

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/cms/auth-helpers'
import { validateMediaUpload } from '@/lib/cms/media-validation'
import { uploadFile, deleteFile, generateStorageKey } from '@/lib/cms/storage'
import { mediaUploadMetaSchema } from '@/lib/cms/schemas'

const PAGE_SIZE = 24

// ─── Upload ───────────────────────────────────────────────────────────────────

/**
 * Uploads a new media asset.
 *
 * @param {{
 *   buffer: Buffer,
 *   filename: string,
 *   mimeType: string,
 *   sizeBytes: number,
 *   width?: number,
 *   height?: number,
 *   altText?: string,
 * }} params
 * @param {object|null} fieldRule - optional field rule for dimension/size constraints
 * @returns {Promise<{ success: boolean, asset?: object, errors?: string[] }>}
 */
export async function uploadMedia(params, fieldRule = null) {
  const session = await requireAdmin()

  // 1. Validate metadata schema
  const metaParsed = mediaUploadMetaSchema.safeParse({
    filename:  params.filename,
    mimeType:  params.mimeType,
    sizeBytes: params.sizeBytes,
    width:     params.width,
    height:    params.height,
    altText:   params.altText ?? '',
  })

  if (!metaParsed.success) {
    return {
      success: false,
      errors: metaParsed.error.errors.map((e) => e.message),
    }
  }

  // 2. Validate file content (MIME, size, dimensions)
  const validation = validateMediaUpload(
    {
      filename:  params.filename,
      mimeType:  params.mimeType,
      sizeBytes: params.sizeBytes,
      width:     params.width,
      height:    params.height,
    },
    fieldRule
  )

  if (!validation.valid) {
    return { success: false, errors: validation.errors }
  }

  // 3. Generate storage key and upload to S3
  const storageKey = generateStorageKey(params.filename)

  let storageResult
  try {
    storageResult = await uploadFile({
      buffer:     params.buffer,
      storageKey,
      mimeType:   params.mimeType,
      sizeBytes:  params.sizeBytes,
    })
  } catch (err) {
    console.error('Storage upload failed:', err)
    return { success: false, errors: ['Storage upload failed. Please try again.'] }
  }

  // 4. Insert DB record — prefer storage-reported dimensions when available
  const finalWidth  = storageResult.width  ?? params.width  ?? null
  const finalHeight = storageResult.height ?? params.height ?? null
  let asset
  try {
    asset = await prisma.mediaAsset.create({
      data: {
        filename:     params.filename,
        storageKey:   storageResult.storageKey,
        publicUrl:    storageResult.publicUrl,
        mimeType:     params.mimeType,
        sizeBytes:    params.sizeBytes,
        width:        finalWidth,
        height:       finalHeight,
        altText:      metaParsed.data.altText,
        uploadedById: session.user.id,
        updatedAt:    new Date(),
      },
    })
  } catch (err) {
    console.error('DB create failed — rolling back Cloudinary:', err)
    try { await deleteFile(storageResult.storageKey) } catch {}
    if (err.code === 'P2002') return { success: false, errors: ['A file with this storage key already exists. Please retry.'] }
    return { success: false, errors: ['Database error — upload rolled back. Please try again.'] }
  }

  // 5. Audit log
  await writeAudit(session.user.id, 'UPLOAD_MEDIA', 'MediaAsset', asset.id, {
    filename: asset.filename,
    sizeBytes: asset.sizeBytes,
  })

  return { success: true, asset: serializeAsset(asset) }
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Deletes a media asset.
 * Blocks deletion if the asset is still referenced by any ContentBlock.
 *
 * @param {string} assetId
 * @param {{ force?: boolean }} options - force:true bypasses the reference check (use with caution)
 * @returns {Promise<{ success: boolean, error?: string, references?: number }>}
 */
export async function deleteMedia(assetId, { force = false } = {}) {
  const session = await requireAdmin()

  const asset = await prisma.mediaAsset.findUnique({
    where: { id: assetId },
    include: { _count: { select: { contentBlocks: true } } },
  })

  if (!asset) {
    return { success: false, error: 'Asset not found.' }
  }

  const refCount = asset._count.contentBlocks

  // Block deletion if referenced (unless force flag is set)
  if (refCount > 0 && !force) {
    return {
      success: false,
      error: `This image is used in ${refCount} content block${refCount === 1 ? '' : 's'}. Remove those references before deleting.`,
      references: refCount,
    }
  }

  // Delete from S3 first — if this fails, don't delete the DB record
  try {
    await deleteFile(asset.storageKey)
  } catch (err) {
    console.error('Storage delete failed:', err)
    return { success: false, error: 'Storage deletion failed. The asset record was not removed.' }
  }

  // Delete DB record (cascades to ContentBlock via SetNull on mediaAssetId)
  await prisma.mediaAsset.delete({ where: { id: assetId } })

  await writeAudit(session.user.id, 'DELETE_MEDIA', 'MediaAsset', assetId, {
    filename: asset.filename,
    storageKey: asset.storageKey,
    forcedDelete: force,
  })

  return { success: true }
}

// ─── List ─────────────────────────────────────────────────────────────────────

/**
 * Lists media assets with pagination and optional search.
 *
 * @param {{ page?: number, search?: string, mimeType?: string }} params
 * @returns {Promise<{ assets: object[], total: number, pages: number }>}
 */
export async function listMedia({ page = 1, search = '', mimeType = '' } = {}) {
  await requireAdmin()

  const skip = (page - 1) * PAGE_SIZE

  const where = {
    ...(search ? {
      filename: { contains: search, mode: 'insensitive' },
    } : {}),
    ...(mimeType ? { mimeType: { startsWith: mimeType } } : {}),
  }

  const [assets, total] = await Promise.all([
    prisma.mediaAsset.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.mediaAsset.count({ where }),
  ])

  return {
    assets: assets.map(serializeAsset),
    total,
    pages: Math.ceil(total / PAGE_SIZE),
    page,
  }
}

// ─── Get single ───────────────────────────────────────────────────────────────

/**
 * Gets a single media asset by ID.
 *
 * @param {string} assetId
 * @returns {Promise<{ success: boolean, asset?: object, error?: string }>}
 */
export async function getMedia(assetId) {
  await requireAdmin()

  const asset = await prisma.mediaAsset.findUnique({
    where: { id: assetId },
    include: {
      _count: { select: { contentBlocks: true } },
    },
  })

  if (!asset) return { success: false, error: 'Asset not found.' }

  return {
    success: true,
    asset: {
      ...serializeAsset(asset),
      referenceCount: asset._count.contentBlocks,
    },
  }
}

// ─── Update alt text ──────────────────────────────────────────────────────────

/**
 * Updates the alt text of a media asset.
 *
 * @param {string} assetId
 * @param {string} altText
 * @returns {Promise<{ success: boolean, asset?: object, error?: string }>}
 */
export async function updateMediaAlt(assetId, altText) {
  const session = await requireAdmin()

  if (typeof altText !== 'string' || altText.length > 200) {
    return { success: false, error: 'Alt text must be a string of max 200 characters.' }
  }

  const asset = await prisma.mediaAsset.update({
    where: { id: assetId },
    data: { altText: altText.trim(), updatedAt: new Date() },
  })

  await writeAudit(session.user.id, 'UPDATE_MEDIA_ALT', 'MediaAsset', assetId, {
    altText: altText.trim(),
  })

  return { success: true, asset: serializeAsset(asset) }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Serializes a Prisma MediaAsset for JSON responses.
 * Ensures dates are strings and no internal fields leak.
 */
function serializeAsset(asset) {
  return {
    id:          asset.id,
    filename:    asset.filename,
    storageKey:  asset.storageKey,
    publicUrl:   asset.publicUrl,
    mimeType:    asset.mimeType,
    sizeBytes:   asset.sizeBytes,
    width:       asset.width,
    height:      asset.height,
    altText:     asset.altText,
    uploadedById: asset.uploadedById,
    createdAt:   asset.createdAt.toISOString(),
    updatedAt:   asset.updatedAt.toISOString(),
  }
}

/**
 * Writes an audit log entry.
 */
async function writeAudit(userId, action, entityType, entityId, metadata = {}) {
  try {
    await prisma.auditLog.create({
      data: { userId, action, entityType, entityId, metadata },
    })
  } catch (err) {
    // Audit failures must never break the main operation
    console.error('Audit log write failed:', err)
  }
}
