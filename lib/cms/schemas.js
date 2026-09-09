import { z } from 'zod'
import { fieldRules } from './field-rules.js'
import { GIVE_ONE_HOUR_AVAILABILITY, CONTACT_SUBJECTS } from './form-validation.js'

const MB = 1024 * 1024

const ALLOWED_MIME_TYPES = [
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
]

/**
 * Builds a Zod schema for a single field rule object.
 * Used server-side as the authoritative validation layer.
 *
 * @param {object} rule - a leaf rule from fieldRules
 * @returns {z.ZodTypeAny}
 */
export function buildFieldSchema(rule) {
  if (!rule || !rule.type) return z.unknown()

  switch (rule.type) {
    case 'text':
    case 'rich_text': {
      let schema = z.string()
      if (rule.minLength) schema = schema.min(rule.minLength, `Minimum ${rule.minLength} characters`)
      if (rule.maxLength) schema = schema.max(rule.maxLength, `Maximum ${rule.maxLength} characters`)
      return rule.required ? schema : schema.optional().or(z.literal(''))
    }

    case 'url': {
      let schema = z.string().max(rule.maxLength ?? 300, `Maximum ${rule.maxLength ?? 300} characters`)
      if (rule.required) {
        schema = schema.min(1, 'URL is required').refine(
          (v) => v.startsWith('/') || v.startsWith('http://') || v.startsWith('https://'),
          'Must be a relative path (/) or absolute URL (http/https)'
        )
      }
      return rule.required ? schema : schema.optional().or(z.literal(''))
    }

    case 'select': {
      if (!rule.options?.length) return z.string()
      const [first, ...rest] = rule.options
      return z.enum([first, ...rest])
    }

    case 'image': {
      // For image fields, the CMS stores a mediaAssetId (string cuid).
      // The actual file validation (MIME, size, dimensions) happens at upload time
      // in the media library — see lib/cms/media-validation.js.
      // Here we just validate the reference ID.
      const schema = z.string().cuid('Invalid media asset reference')
      return rule.required ? schema : schema.optional().nullable()
    }

    default:
      return z.unknown()
  }
}

/**
 * Builds a Zod object schema from a flat map of { fieldKey: rule }.
 *
 * @param {Record<string, object>} rulesMap
 * @returns {z.ZodObject}
 */
export function buildObjectSchema(rulesMap) {
  const shape = {}
  for (const [key, rule] of Object.entries(rulesMap)) {
    // Skip nested rule groups (non-leaf nodes don't have a `type`)
    if (rule.type) {
      shape[key] = buildFieldSchema(rule)
    }
  }
  return z.object(shape)
}

// ─── Pre-built schemas for common operations ──────────────────────────────────

export const seoSchema = z.object({
  metaTitle:       z.string().max(70, 'Maximum 70 characters').optional().or(z.literal('')),
  metaDescription: z.string().max(170, 'Maximum 170 characters').optional().or(z.literal('')),
  ogTitle:         z.string().max(95, 'Maximum 95 characters').optional().or(z.literal('')),
  ogDescription:   z.string().max(200, 'Maximum 200 characters').optional().or(z.literal('')),
  // ogImage is stored as a URL string (not a mediaAssetId) in the SEO form
  ogImage:         z.string().max(500).optional().or(z.literal('')),
  canonical:       z.string().max(300, 'Maximum 300 characters').optional().or(z.literal('')),
  noIndex:         z.union([z.boolean(), z.enum(['index', 'noindex'])]).optional(),
})

export const footerSchema = buildObjectSchema(fieldRules.footer)

export const navigationItemSchema = buildObjectSchema(fieldRules.navigationItem)

export const contentSectionSchema = buildObjectSchema(fieldRules.contentSection)

// ─── Media upload validation schema ──────────────────────────────────────────
// This validates the metadata sent alongside a file upload.
// Actual file bytes are validated in the upload handler using media-validation.js.

export const mediaUploadMetaSchema = z.object({
  altText: z.string().max(200, 'Alt text max 200 characters').optional().default(''),
  filename: z.string().min(1).max(255),
  mimeType: z.enum(
    ALLOWED_MIME_TYPES,
    { errorMap: () => ({ message: `Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}` }) }
  ),
  sizeBytes: z.number().int().positive().max(10 * MB, 'File must be under 10MB'),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
})

// ─── Auth schemas ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  username: z.string().email('Enter a valid email address.').max(254),
  password: z.string().min(1, 'Password is required').max(128),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .max(128)
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// ─── Public form schemas (contact, give-one-hour, newsletter) ─────────────────

export const contactFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or fewer')
    .regex(/^[A-Za-z ]+$/u, 'Name can only contain letters and spaces'),
  email: z.string().email('Invalid email address').max(254, 'Email must be 254 characters or fewer'),
  phone: z.string()
    .max(25, 'Phone must be 25 characters or fewer')
    .regex(/^[0-9+ -]*$/u, 'Phone can only contain numbers, spaces, + or -')
    .optional()
    .or(z.literal('')),
  subject: z.enum(CONTACT_SUBJECTS, { errorMap: () => ({ message: 'Please select a subject' }) }),
  comment: z.string().max(2000, 'Message must be 2000 characters or fewer').optional().or(z.literal('')),
})

export const giveOneHourSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(80).refine(v => !/[\n\r]/.test(v), 'Use a single line'),
  linkedin: z.string().url('Must be a valid URL').max(300).refine(v => /^https?:\/\/(www\.)?linkedin\.com\//i.test(v), 'Must be a LinkedIn URL'),
  organisation: z.string().min(1, 'Organisation is required').max(120),
  role: z.string().min(1, 'Role is required').max(80).refine(v => !/[\n\r]|https?:\/\//i.test(v), 'Role must be plain text'),
  expertise: z.string().min(1, 'Area of expertise is required').max(160),
  how_to_help: z.string().min(10, 'Please provide at least 10 characters').max(1000),
  availability: z.enum(GIVE_ONE_HOUR_AVAILABILITY),
  format: z.enum(['online', 'in_person', 'both'], {
    errorMap: () => ({ message: 'Please select a format' }),
  }),
  anything_else: z.string().max(1000).optional().or(z.literal('')),
})

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address').max(254),
})

// ─── Dynamic form builder (FormDefinition.fields → Zod) ───────────────────────

function fieldToZod(field) {
  const label = field.label || field.key || 'Field'
  const type = (field.type || 'text').toLowerCase()

  if (type === 'number') {
    const n = z.coerce.number({ invalid_type_error: `${label} must be a number` })
    return field.required ? n : n.optional().or(z.literal(''))
  }

  if (type === 'checkbox') {
    if (field.required) return z.literal(true, { errorMap: () => ({ message: `${label} is required` }) })
    return z.boolean().optional()
  }

  if (type === 'select' || type === 'radio') {
    const opts = Array.isArray(field.options) && field.options.length ? field.options : null
    const base = opts
      ? z.enum(opts, { errorMap: () => ({ message: `Please select a valid ${label.toLowerCase()}` }) })
      : z.string()
    if (field.required) return base
    return base.optional().or(z.literal(''))
  }

  let base = z.string()
  if (type === 'email') base = z.string().email(`Invalid ${label.toLowerCase()}`)
  else if (type === 'url') base = z.string().url(`Must be a valid URL`)
  else if (type === 'tel') base = z.string().regex(/^[0-9+ -]+$/u, `Invalid ${label.toLowerCase()}`)

  if (field.maxLength) base = base.max(field.maxLength, `${label} must be ${field.maxLength} characters or fewer`)
  else if (type !== 'email' && type !== 'url') base = base.max(5000, `${label} must be 5000 characters or fewer`)

  if (field.pattern) base = base.regex(new RegExp(field.pattern), field.patternMessage || `Invalid ${label.toLowerCase()}`)

  if (!field.required) return base.optional().or(z.literal(''))
  return base.min(field.minLength ?? 1, `${label} is required`)
}

/**
 * Builds a Zod object schema from a FormDefinition.fields array.
 * Each entry: { key, type, label, required, minLength, maxLength, options }.
 */
export function buildDynamicFormSchema(fields = []) {
  const shape = {}
  for (const f of fields) {
    if (!f?.key) continue
    shape[f.key] = fieldToZod(f)
  }
  return z.object(shape)
}
