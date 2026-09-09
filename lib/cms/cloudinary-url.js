/**
 * Cloudinary delivery URL presets — f_auto/q_auto + responsive sizes.
 * Storage-agnostic: legacy local/S3 URLs pass through unchanged (storage.js handles it).
 */
import { getPublicUrl } from '@/lib/cms/storage'

const PRESETS = {
  thumb: { width: 320,  crop: 'fill', gravity: 'auto', fetch_format: 'auto', quality: 'auto' },
  card:  { width: 674, height: 452, crop: 'fill', gravity: 'auto', fetch_format: 'auto', quality: 'auto' },
  contentLeft: { width: 750, height: 800, crop: 'fill', gravity: 'auto', fetch_format: 'auto', quality: 'auto' },
  contentRight: { width: 600, height: 600, crop: 'fill', gravity: 'auto', fetch_format: 'auto', quality: 'auto' },
  hero:  { width: 1920, crop: 'fill', gravity: 'auto', fetch_format: 'auto', quality: 'auto' },
  team:  { width: 600, height: 756, crop: 'fill', gravity: 'face', fetch_format: 'auto', quality: 'auto' },
}

/**
 * Returns a Cloudinary-transformed URL for a given publicUrl/storageKey.
 * Falls back to original URL for non-Cloudinary (local/S3) rows.
 * @param {string} publicUrlOrId - publicUrl or storageKey (public_id)
 * @param {'thumb'|'card'|'hero'|'team'|object} preset - preset name or custom transforms object
 */
export function cloudinaryUrl(publicUrlOrId, preset = 'card') {
  if (!publicUrlOrId) return publicUrlOrId
  // If it's a Cloudinary public_id (no slashes or http), route through getPublicUrl
  // For full URLs, getPublicUrl handles pass-through/transform delegation
  const transforms = typeof preset === 'string' ? (PRESETS[preset] ?? null) : preset
  // Only transform Cloudinary IDs/URLs; local /uploads/* pass through
  if (publicUrlOrId.includes('res.cloudinary.com') || publicUrlOrId.startsWith('chc/')) {
    return getPublicUrl(publicUrlOrId, transforms)
  }
  return publicUrlOrId
}

export const cloudinaryPresets = PRESETS
