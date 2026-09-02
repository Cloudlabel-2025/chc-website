/**
 * CHC CMS — Footer Actions
 *
 * FooterConfig is a single-row table. getFooter() returns the row (or null if
 * not yet seeded). updateFooter() upserts it.
 */

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/cms/auth-helpers'
import { footerSchema } from '@/lib/cms/schemas'

// ─── Get ──────────────────────────────────────────────────────────────────────

/**
 * Returns the current footer config, or null if not yet created.
 */
export async function getFooter() {
  await requireAdmin()
  return prisma.footerConfig.findFirst()
}

// ─── Update ───────────────────────────────────────────────────────────────────

/**
 * Upserts the footer config row.
 *
 * @param {object} data - fields matching FooterConfig model
 * @returns {Promise<{ success: boolean, footer?: object, errors?: string[] }>}
 */
export async function updateFooter(data) {
  const session = await requireAdmin()

  const parsed = footerSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.errors.map((e) => e.message) }
  }

  const existing = await prisma.footerConfig.findFirst({ select: { id: true } })

  const footer = existing
    ? await prisma.footerConfig.update({
        where: { id: existing.id },
        data: { ...parsed.data, updatedById: session.user.id },
      })
    : await prisma.footerConfig.create({
        data: { ...parsed.data, updatedById: session.user.id },
      })

  await writeAudit(session.user.id, 'UPDATE_FOOTER', 'FooterConfig', footer.id, {})
  return { success: true, footer }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function writeAudit(userId, action, entityType, entityId, metadata = {}) {
  try {
    await prisma.auditLog.create({ data: { userId, action, entityType, entityId, metadata } })
  } catch (err) {
    console.error('Audit log write failed:', err)
  }
}
