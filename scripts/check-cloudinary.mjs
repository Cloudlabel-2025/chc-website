/**
 * Read-only Cloudinary health check.
 * Verifies that the configured server-side credentials can reach Cloudinary's
 * Admin API without creating or changing any media asset.
 */
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local', override: false })
dotenv.config({ path: '.env', override: false })

const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

if (!cloudName || !apiKey || !apiSecret) {
  console.error('Cloudinary is not configured: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are required.')
  process.exit(1)
}

try {
  const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image?max_results=1`, {
    headers: { Authorization: `Basic ${credentials}` },
  })
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? `Cloudinary returned HTTP ${response.status}`)
  }

  console.log('Cloudinary API credentials and network connection verified.')
} catch (error) {
  const cause = error.cause ?? error
  const detail = cause?.code ? `${cause.code}: ${cause.message}` : error.message
  console.error(`Cloudinary health check failed: ${detail}`)
  process.exit(1)
}
