/**
 * CHC CMS — SEO Actions
 *
 * SeoMeta is a 1:1 relation to Page. getSeo() returns the row for a given
 * page slug. updateSeo() upserts it.
 */

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/cms/auth-helpers'
import { seoSchema } from '@/lib/cms/schemas'

// ─── Get ──────────────────────────────────────────────────────────────────────

/**
 * Returns the SEO meta for a page by slug, or null if not yet created.
 *
 * @param {string} slug - page slug, e.g. "home", "about"
 */
export async function getSeo(slug) {
  await requireAdmin()
  return prisma.seoMeta.findFirst({
    where: { page: { slug } },
    include: { page: { select: { id: true, slug: true, title: true } } },
  })
}

/**
 * Returns SEO meta for all pages (for the SEO overview table).
 */
export async function listSeo() {
  await requireAdmin()
  return prisma.seoMeta.findMany({
    include: { page: { select: { id: true, slug: true, title: true } } },
    orderBy: { page: { slug: 'asc' } },
  })
}

// ─── Update ───────────────────────────────────────────────────────────────────

/**
 * Upserts SEO meta for a page.
 *
 * @param {string} slug - page slug
 * @param {object} data - fields matching seoSchema
 * @returns {Promise<{ success: boolean, seo?: object, errors?: string[] }>}
 */
export async function updateSeo(slug, data) {
  const session = await requireAdmin()

  // noIndex arrives as string 'index'|'noindex' from the form, or boolean from API; normalise to boolean
  const normalized = {
    ...data,
    noIndex: data.noIndex === 'noindex' || data.noIndex === true,
  }

  const parsed = seoSchema.safeParse(normalized)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.errors.map((e) => e.message) }
  }

  const page = await prisma.page.findUnique({
    where: { slug },
    select: { id: true },
  })
  if (!page) return { success: false, errors: [`Page "${slug}" not found`] }

  const existing = await prisma.seoMeta.findUnique({ where: { pageId: page.id } })

  const seoData = {
    metaTitle:       parsed.data.metaTitle       ?? '',
    metaDescription: parsed.data.metaDescription ?? '',
    ogTitle:         parsed.data.ogTitle         ?? '',
    ogDescription:   parsed.data.ogDescription   ?? '',
    ogImageUrl:      parsed.data.ogImage         ?? '',  // ogImage in schema → ogImageUrl in DB
    canonical:       parsed.data.canonical       ?? '',
    noIndex:         normalized.noIndex,
    updatedById:     session.user.id,
  }

  const seo = existing
    ? await prisma.seoMeta.update({ where: { id: existing.id }, data: seoData })
    : await prisma.seoMeta.create({ data: { pageId: page.id, ...seoData } })

  await writeAudit(session.user.id, 'UPDATE_SEO', 'SeoMeta', seo.id, { slug })
  return { success: true, seo }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function writeAudit(userId, action, entityType, entityId, metadata = {}) {
  try {
    await prisma.auditLog.create({ data: { userId, action, entityType, entityId, metadata } })
  } catch (err) {
    console.error('Audit log write failed:', err)
  }
}
