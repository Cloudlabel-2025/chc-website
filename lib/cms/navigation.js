/**
 * CHC CMS — Navigation Actions
 *
 * Manages NavigationItem records (top-level + dropdown children).
 * All functions are server-only and require admin auth.
 */

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/cms/auth-helpers'
import { navigationItemSchema } from '@/lib/cms/schemas'
import { DEFAULT_NAVIGATION } from '@/lib/cms/navigation-defaults'

// ─── List ─────────────────────────────────────────────────────────────────────

/**
 * Returns all top-level nav items with their children, ordered by sortOrder.
 */
export async function listNavItems() {
  await requireAdmin()
  return prisma.navigationItem.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: 'asc' },
    include: {
      children: { orderBy: { sortOrder: 'asc' } },
    },
  })
}

// ─── Create ───────────────────────────────────────────────────────────────────

/**
 * Creates a new nav item.
 *
 * @param {{ label: string, href: string, badge?: string, parentId?: string, sortOrder?: number }} data
 */
export async function createNavItem(data) {
  const session = await requireAdmin()

  const parsed = navigationItemSchema.safeParse({
    label: data.label,
    href: data.href,
    badge: data.badge ?? '',
  })
  if (!parsed.success) {
    return { success: false, errors: parsed.error.issues.map((e) => e.message) }
  }

  // Determine next sortOrder if not provided
  const sortOrder = data.sortOrder ?? (await getNextSortOrder(data.parentId ?? null))

  const item = await prisma.navigationItem.create({
    data: {
      label: parsed.data.label,
      href: parsed.data.href,
      badge: parsed.data.badge || null,
      parentId: data.parentId ?? null,
      sortOrder,
      updatedById: session.user.id,
    },
  })

  await writeAudit(session.user.id, 'CREATE_NAV_ITEM', 'NavigationItem', item.id, {
    label: item.label,
    href: item.href,
  })

  return { success: true, item }
}

// ─── Update ───────────────────────────────────────────────────────────────────

/**
 * Updates a nav item's label, href, badge, or visibility.
 *
 * @param {string} itemId
 * @param {{ label?: string, href?: string, badge?: string, isVisible?: boolean }} data
 */
export async function updateNavItem(itemId, data) {
  const session = await requireAdmin()

  const update = {}
  if (data.label !== undefined) update.label = data.label.trim()
  if (data.href !== undefined) update.href = data.href.trim()
  if (data.badge !== undefined) update.badge = data.badge?.trim() || null
  if (data.isVisible !== undefined) update.isVisible = Boolean(data.isVisible)
  update.updatedById = session.user.id

  const item = await prisma.navigationItem.update({ where: { id: itemId }, data: update })
  await writeAudit(session.user.id, 'UPDATE_NAV_ITEM', 'NavigationItem', itemId, data)
  return { success: true, item }
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Deletes a nav item and its children (cascade via schema).
 *
 * @param {string} itemId
 */
export async function deleteNavItem(itemId) {
  const session = await requireAdmin()
  await prisma.navigationItem.delete({ where: { id: itemId } })
  await writeAudit(session.user.id, 'DELETE_NAV_ITEM', 'NavigationItem', itemId, {})
  return { success: true }
}

// ─── Reorder ──────────────────────────────────────────────────────────────────

/**
 * Bulk-updates sortOrder for a list of nav items.
 *
 * @param {{ id: string, sortOrder: number }[]} items
 */
export async function reorderNavItems(items) {
  const session = await requireAdmin()
  await prisma.$transaction(
    items.map(({ id, sortOrder }) =>
      prisma.navigationItem.update({
        where: { id },
        data: { sortOrder, updatedById: session.user.id },
      })
    )
  )
  return { success: true }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getNextSortOrder(parentId) {
  const last = await prisma.navigationItem.findFirst({
    where: { parentId },
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  })
  return (last?.sortOrder ?? -1) + 1
}

async function writeAudit(userId, action, entityType, entityId, metadata = {}) {
  try {
    await prisma.auditLog.create({ data: { userId, action, entityType, entityId, metadata } })
  } catch (err) {
    console.error('Audit log write failed:', err)
  }
}

/** Restores the public site's default menu, replacing existing nav items. */
export async function restoreDefaultNavigation(userId) {
  await prisma.navigationItem.deleteMany({})
  const created = []

  for (const item of DEFAULT_NAVIGATION) {
    const parent = await prisma.navigationItem.create({
      data: {
        label: item.label, href: item.href, badge: item.badge, sortOrder: item.sortOrder,
        isVisible: true, updatedById: userId,
      },
    })
    created.push(parent)

    for (const child of item.children) {
      await prisma.navigationItem.create({
        data: {
          label: child.label, href: child.href, icon: child.icon ?? null,
          description: child.description ?? null, parentId: parent.id, sortOrder: child.sortOrder,
          isVisible: true, updatedById: userId,
        },
      })
    }
  }

  await writeAudit(userId, 'RESTORE_DEFAULT_NAVIGATION', 'NavigationItem', null, { count: created.length })
  return created.length
}
