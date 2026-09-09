/**
 * CHC CMS — Form Submission Actions
 *
 * Handles reading and managing FormSubmission records.
 * Public form handlers (contact, give-one-hour) write to this
 * table via the public API routes — those do NOT require admin auth.
 * All read/manage operations here DO require admin auth.
 */

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/cms/auth-helpers'

const PAGE_SIZE = 20

// ─── List ─────────────────────────────────────────────────────────────────────

/**
 * Lists form submissions with pagination and optional filter by formType.
 *
 * @param {{ page?: number, formType?: string, unreadOnly?: boolean }} params
 */
export async function listSubmissions({ page = 1, formType = '', unreadOnly = false } = {}) {
  await requireAdmin()

  const skip = (page - 1) * PAGE_SIZE

  const where = {
    ...(formType ? { formType } : {}),
    ...(unreadOnly ? { isRead: false } : {}),
  }

  const [submissions, total] = await Promise.all([
    prisma.formSubmission.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
      skip,
      take: PAGE_SIZE,
      include: { formDefinition: { select: { id: true, title: true, slug: true } } },
    }),
    prisma.formSubmission.count({ where }),
  ])

  return {
    submissions,
    total,
    pages: Math.ceil(total / PAGE_SIZE),
    page,
  }
}

// ─── Get single ───────────────────────────────────────────────────────────────

/**
 * Gets a single submission by ID and marks it as read.
 *
 * @param {string} submissionId
 */
export async function getSubmission(submissionId) {
  await requireAdmin()

  const submission = await prisma.formSubmission.findUnique({
    where: { id: submissionId },
  })

  if (!submission) return { success: false, error: 'Submission not found.' }

  // Auto-mark as read on open
  if (!submission.isRead) {
    await prisma.formSubmission.update({
      where: { id: submissionId },
      data: { isRead: true },
    })
  }

  return { success: true, submission: { ...submission, isRead: true } }
}

// ─── Mark read ────────────────────────────────────────────────────────────────

/**
 * Marks one or more submissions as read/unread.
 *
 * @param {string[]} ids
 * @param {boolean} isRead
 */
export async function markSubmissionsRead(ids, isRead = true) {
  await requireAdmin()

  await prisma.formSubmission.updateMany({
    where: { id: { in: ids } },
    data: { isRead: Boolean(isRead) },
  })

  return { success: true }
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Deletes a form submission.
 *
 * @param {string} submissionId
 */
export async function deleteSubmission(submissionId) {
  const session = await requireAdmin()

  await prisma.formSubmission.delete({ where: { id: submissionId } })

  await writeAudit(session.user.id, 'DELETE_SUBMISSION', 'FormSubmission', submissionId, {})
  return { success: true }
}

// ─── Counts ───────────────────────────────────────────────────────────────────

/**
 * Returns unread counts per form type (for dashboard badges).
 */
export async function getSubmissionCounts() {
  await requireAdmin()

  const [total, unread] = await Promise.all([
    prisma.formSubmission.count(),
    prisma.formSubmission.count({ where: { isRead: false } }),
  ])

  return { total, unread }
}

// ─── Public submit (no auth required) ────────────────────────────────────────

/**
 * Records a validated form submission. Called from public API routes.
 * Does NOT require admin auth — this is the public-facing write path.
 *
 * @param {{ formType: 'CONTACT'|'GIVE_ONE_HOUR'|'CUSTOM', data: object, ipAddress?: string, formDefinitionId?: string }} params
 */
export async function recordSubmission({ formType, data, ipAddress, formDefinitionId }) {
  return prisma.formSubmission.create({
    data: {
      formType,
      data,
      ipAddress: ipAddress ?? null,
      formDefinitionId: formDefinitionId ?? null,
    },
  })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function writeAudit(userId, action, entityType, entityId, metadata = {}) {
  try {
    await prisma.auditLog.create({ data: { userId, action, entityType, entityId, metadata } })
  } catch (err) {
    console.error('Audit log write failed:', err)
  }
}
