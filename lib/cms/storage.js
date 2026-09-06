/**
 * CHC CMS — Storage Client (Cloudinary-only)
 *
 * Server-side uploads to Cloudinary via signed upload API.
 * No npm dependency — uses global fetch + node:crypto.
 *
 * Required env (server only, never expose to client):
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *
 * All env vars are read at call time (not module load) so the module
 * can be imported without crashing when vars are not yet set.
 */

import { randomBytes, createHash } from 'crypto'
import path from 'path'

function cloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey    = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Storage not configured: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are required.'
    )
  }
  return { cloudName, apiKey, apiSecret }
}

function signParams(params, apiSecret) {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&') + apiSecret
  return createHash('sha1').update(toSign).digest('hex')
}

/**
 * Generates a unique, safe storage key for an uploaded file.
 * Format: chc/media/YYYY/MM/<16-hex-random>.<ext>
 * (Cloudinary public_id = same path without extension.)
 */
export function generateStorageKey(originalFilename) {
  const ext  = path.extname(originalFilename).toLowerCase().replace(/[^a-z0-9.]/g, '')
  const rand = randomBytes(8).toString('hex')
  const now  = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  return `chc/media/${year}/${month}/${rand}${ext}`
}

function publicIdFromKey(storageKey) {
  return storageKey.replace(/\.[^.]+$/, '')
}

/**
 * Uploads a file buffer to Cloudinary (signed upload).
 *
 * @param {{
 *   buffer: Buffer,
 *   storageKey: string,
 *   mimeType: string,
 *   sizeBytes: number,
 * }} params
 * @returns {Promise<{ storageKey: string, publicUrl: string, width?: number, height?: number }>}
 */
export async function uploadFile({ buffer, storageKey, mimeType, sizeBytes }) {
  const { cloudName, apiKey, apiSecret } = cloudinaryConfig()

  const publicId = publicIdFromKey(storageKey)
  const timestamp = Math.floor(Date.now() / 1000)
  const uploadParams = {
    timestamp: String(timestamp),
    public_id: publicId,
    overwrite: 'true',
    unique_filename: 'false',
  }
  const signature = signParams(uploadParams, apiSecret)

  const form = new FormData()
  form.append('file', new Blob([buffer], { type: mimeType }), path.basename(storageKey) || 'upload')
  form.append('api_key', apiKey)
  form.append('timestamp', uploadParams.timestamp)
  form.append('public_id', publicId)
  form.append('overwrite', 'true')
  form.append('unique_filename', 'false')
  form.append('signature', signature)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.error) {
    throw new Error(`Cloudinary upload failed: ${data?.error?.message ?? res.statusText}`)
  }

  return {
    storageKey,
    publicUrl: data.secure_url,
    width: data.width ?? null,
    height: data.height ?? null,
  }
}

/**
 * Deletes a file from Cloudinary (signed destroy).
 *
 * @param {string} storageKey
 * @returns {Promise<void>}
 */
export async function deleteFile(storageKey) {
  const { cloudName, apiKey, apiSecret } = cloudinaryConfig()

  const timestamp = Math.floor(Date.now() / 1000)
  const publicId = publicIdFromKey(storageKey)
  const signature = signParams({ timestamp: String(timestamp), public_id: publicId }, apiSecret)

  const form = new FormData()
  form.append('api_key', apiKey)
  form.append('timestamp', String(timestamp))
  form.append('public_id', publicId)
  form.append('signature', signature)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: 'POST',
    body: form,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || (data.result !== 'ok' && data.result !== 'not found')) {
    throw new Error(`Cloudinary destroy failed: ${data?.error?.message ?? res.statusText}`)
  }
}

/**
 * Returns the public delivery URL for an asset.
 * Cloudinary delivery URLs are public by default.
 */
export async function getPresignedUrl(storageKey) {
  const { cloudName } = cloudinaryConfig()
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicIdFromKey(storageKey)}`
}
