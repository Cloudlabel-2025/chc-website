/**
 * CHC CMS — Storage Client
 *
 * S3-compatible object storage using AWS SDK v3.
 * Works with AWS S3, Cloudflare R2, and MinIO.
 *
 * All env vars are read at call time (not module load) so the module
 * can be imported without crashing when vars are not yet set.
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomBytes } from 'crypto'
import path from 'path'

/** @returns {S3Client} */
function getS3Client() {
  const endpoint = process.env.STORAGE_ENDPOINT
  const region   = process.env.STORAGE_REGION   ?? 'auto'
  const accessKeyId     = process.env.STORAGE_ACCESS_KEY_ID
  const secretAccessKey = process.env.STORAGE_SECRET_ACCESS_KEY

  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      'Storage not configured: STORAGE_ACCESS_KEY_ID and STORAGE_SECRET_ACCESS_KEY are required.'
    )
  }

  return new S3Client({
    region,
    ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
    credentials: { accessKeyId, secretAccessKey },
  })
}

function getBucket() {
  const bucket = process.env.STORAGE_BUCKET
  if (!bucket) throw new Error('Storage not configured: STORAGE_BUCKET is required.')
  return bucket
}

function getPublicUrl(storageKey) {
  const base = process.env.STORAGE_PUBLIC_URL
  if (!base) throw new Error('Storage not configured: STORAGE_PUBLIC_URL is required.')
  return `${base.replace(/\/$/, '')}/${storageKey}`
}

/**
 * Generates a unique, safe storage key for an uploaded file.
 * Format: media/YYYY/MM/<16-hex-random>.<ext>
 *
 * @param {string} originalFilename
 * @returns {string}
 */
export function generateStorageKey(originalFilename) {
  const ext  = path.extname(originalFilename).toLowerCase().replace(/[^a-z0-9.]/g, '')
  const rand = randomBytes(8).toString('hex')
  const now  = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  return `media/${year}/${month}/${rand}${ext}`
}

/**
 * Uploads a file buffer to S3-compatible storage.
 *
 * @param {{
 *   buffer: Buffer,
 *   storageKey: string,
 *   mimeType: string,
 *   sizeBytes: number,
 * }} params
 * @returns {Promise<{ storageKey: string, publicUrl: string }>}
 */
export async function uploadFile({ buffer, storageKey, mimeType, sizeBytes }) {
  const client = getS3Client()
  const bucket = getBucket()

  await client.send(new PutObjectCommand({
    Bucket:        bucket,
    Key:           storageKey,
    Body:          buffer,
    ContentType:   mimeType,
    ContentLength: sizeBytes,
    // Prevent public access via ACL — serve via STORAGE_PUBLIC_URL (CDN/presigned)
    // ACL is omitted intentionally; bucket policy controls public read
  }))

  return {
    storageKey,
    publicUrl: getPublicUrl(storageKey),
  }
}

/**
 * Deletes a file from S3-compatible storage.
 *
 * @param {string} storageKey
 * @returns {Promise<void>}
 */
export async function deleteFile(storageKey) {
  const client = getS3Client()
  const bucket = getBucket()

  await client.send(new DeleteObjectCommand({
    Bucket: bucket,
    Key:    storageKey,
  }))
}

/**
 * Generates a short-lived presigned GET URL for a private asset.
 * Use this if the bucket is not publicly readable.
 *
 * @param {string} storageKey
 * @param {number} expiresInSeconds - default 3600 (1 hour)
 * @returns {Promise<string>}
 */
export async function getPresignedUrl(storageKey, expiresInSeconds = 3600) {
  const client = getS3Client()
  const bucket = getBucket()

  const command = new HeadObjectCommand({ Bucket: bucket, Key: storageKey })
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds })
}
