/**
 * CHC CMS — Media Validation
 *
 * Server-side validation for file uploads.
 * Enforces MIME type, file size, and dimension constraints
 * derived from the field-rules config.
 */

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'image/avif',
  'image/heic',
  'image/heif',
  'image/bmp',
  'image/tiff',
  'image/x-icon',
  'image/vnd.microsoft.icon',
])

// Extension → expected MIME (guards against MIME spoofing)
const EXT_TO_MIME = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  gif: 'image/gif',
  avif: 'image/avif',
  heic: 'image/heic',
  heif: 'image/heif',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
  tif: 'image/tiff',
  ico: 'image/x-icon',
}

const GLOBAL_MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB hard ceiling

/**
 * Validates a file upload against a field rule.
 *
 * @param {{
 *   mimeType: string,
 *   sizeBytes: number,
 *   width?: number,
 *   height?: number,
 *   filename: string,
 * }} file
 * @param {object|null} rule - leaf rule from fieldRules (type === 'image'), or null for generic upload
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateMediaUpload(file, rule = null) {
  const errors = []

  // 1. MIME type — global allowlist
  if (!ALLOWED_MIME_TYPES.has(file.mimeType)) {
    errors.push(
      `File type "${file.mimeType}" is not allowed. Accepted: ${[...ALLOWED_MIME_TYPES].join(', ')}`
    )
  }

  // A missing dimension result means the bytes did not match the declared
  // raster format. Never accept MIME metadata supplied by the browser alone.
  // SVG and Cloudinary-handled formats (gif/avif/heic/etc.) don't require pre-parse dims — Cloudinary will provide them.
  const REQUIRES_PRE_DIMS = new Set(['image/jpeg', 'image/png', 'image/webp'])
  if (REQUIRES_PRE_DIMS.has(file.mimeType) && (!file.width || !file.height)) {
    errors.push('The uploaded bytes do not match a supported image format or contain invalid image dimensions')
  }

  // 1b. SVG XSS sanitization — reject if it contains executable content
  if (file.mimeType === 'image/svg+xml' && file._rawText) {
    const svgText = file._rawText
    const xssPatterns = [
      /<script[\s>]/i,
      /\bon\w+\s*=/i,          // onload=, onclick=, etc.
      /javascript\s*:/i,
      /<foreignObject[\s>]/i,
      /<iframe[\s>]/i,
    ]
    for (const pat of xssPatterns) {
      if (pat.test(svgText)) {
        errors.push('SVG contains disallowed executable content and was rejected.')
        break
      }
    }
  }

  // 2. Extension / MIME consistency (guard against spoofing)
  const ext = file.filename.split('.').pop()?.toLowerCase()
  if (ext && EXT_TO_MIME[ext] && EXT_TO_MIME[ext] !== file.mimeType) {
    errors.push(
      `File extension ".${ext}" does not match declared MIME type "${file.mimeType}"`
    )
  }

  // 3. Global size ceiling
  if (file.sizeBytes > GLOBAL_MAX_FILE_SIZE) {
    errors.push(`File size ${formatBytes(file.sizeBytes)} exceeds the global maximum of 10MB`)
  }

  // 4. Rule-specific validation
  if (rule) {
    // MIME allowlist from rule
    if (rule.allowedMimeTypes && !rule.allowedMimeTypes.includes(file.mimeType)) {
      errors.push(
        `This field requires one of: ${rule.allowedMimeTypes.join(', ')}. Got: ${file.mimeType}`
      )
    }

    // File size from rule
    if (rule.maxFileSize && file.sizeBytes > rule.maxFileSize) {
      errors.push(
        `File size ${formatBytes(file.sizeBytes)} exceeds the maximum of ${formatBytes(rule.maxFileSize)} for this field`
      )
    }

    // Dimensions — only for raster images (not SVG)
    if (file.width && file.height) {
      if (rule.minWidth && file.width < rule.minWidth) {
        errors.push(
          `Image width ${file.width}px is below the minimum of ${rule.minWidth}px` +
          (rule.recommendedWidth ? ` (recommended: ${rule.recommendedWidth}px)` : '')
        )
      }
      if (rule.minHeight && file.height < rule.minHeight) {
        errors.push(
          `Image height ${file.height}px is below the minimum of ${rule.minHeight}px` +
          (rule.recommendedHeight ? ` (recommended: ${rule.recommendedHeight}px)` : '')
        )
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Formats bytes into a human-readable string.
 * @param {number} bytes
 * @returns {string}
 */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}
