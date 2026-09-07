/**
 * CHC CMS — Content Actions
 *
 * Covers: Page, Section, ContentBlock
 *
 * All functions are server-only. Every entry point calls requireAdmin().
 *
 * Conventions:
 *   - "slug" is the public URL segment, e.g. "home", "about", "oracle-hcm"
 *   - "sectionKey" maps to field-rules sections, e.g. "hero", "intro", "whatWeDo"
 *   - "fieldKey" maps to field-rules leaf fields, e.g. "heroTitle", "backgroundImage"
 *   - sortOrder is 0-indexed; callers pass the desired order
 */

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/cms/auth-helpers'

// ─── Pages ────────────────────────────────────────────────────────────────────

/**
 * Lists all pages (id, slug, title, isPublished, updatedAt).
 */
export async function listPages() {
  await requireAdmin()
  return prisma.page.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      isPublished: true,
      updatedAt: true,
      _count: { select: { sections: true } },
    },
    orderBy: { slug: 'asc' },
  })
}

/**
 * Gets a single page with all sections and blocks.
 *
 * @param {string} slug
 */
export async function getPage(slug) {
  await requireAdmin()
  const page = await prisma.page.findUnique({
    where: { slug },
    include: {
      seoMeta: true,
      sections: {
        orderBy: { sortOrder: 'asc' },
        include: {
          blocks: {
            orderBy: { sortOrder: 'asc' },
            include: { mediaAsset: true },
            where: { parentId: null }, // top-level blocks only
          },
        },
      },
    },
  })
  return page
}

/**
 * Creates a new page.
 *
 * @param {{ slug: string, title: string }} data
 */
export async function createPage({ slug, title }) {
  const session = await requireAdmin()

  if (!slug || !title) throw new Error('slug and title are required')

  const page = await prisma.page.create({
    data: {
      slug: slug.toLowerCase().trim(),
      title: title.trim(),
      createdById: session.user.id,
      updatedById: session.user.id,
    },
  })

  await writeAudit(session.user.id, 'CREATE_PAGE', 'Page', page.id, { slug, title })
  return page
}

/**
 * Updates page title and/or publish state.
 *
 * @param {string} pageId
 * @param {{ title?: string, isPublished?: boolean }} data
 */
export async function updatePage(pageId, data) {
  const session = await requireAdmin()

  const update = {}
  if (data.title !== undefined) update.title = data.title.trim()
  if (data.isPublished !== undefined) update.isPublished = Boolean(data.isPublished)
  update.updatedById = session.user.id

  const page = await prisma.page.update({ where: { id: pageId }, data: update })
  await writeAudit(session.user.id, 'UPDATE_PAGE', 'Page', pageId, data)
  return page
}

// ─── Sections ─────────────────────────────────────────────────────────────────

/**
 * Upserts a section on a page (creates if not exists, returns existing if found).
 *
 * @param {{ pageId: string, sectionKey: string, sortOrder?: number }} data
 */
export async function upsertSection({ pageId, sectionKey, sortOrder = 0 }) {
  const session = await requireAdmin()

  const section = await prisma.section.upsert({
    where: { pageId_sectionKey: { pageId, sectionKey } },
    create: {
      pageId,
      sectionKey,
      sortOrder,
      createdById: session.user.id,
      updatedById: session.user.id,
    },
    update: {
      sortOrder,
      updatedById: session.user.id,
    },
  })

  return section
}

/**
 * Toggles section visibility.
 *
 * @param {string} sectionId
 * @param {boolean} isVisible
 */
export async function setSectionVisibility(sectionId, isVisible) {
  const session = await requireAdmin()
  const section = await prisma.section.update({
    where: { id: sectionId },
    data: { isVisible: Boolean(isVisible), updatedById: session.user.id },
  })
  await writeAudit(session.user.id, 'SET_SECTION_VISIBILITY', 'Section', sectionId, { isVisible })
  return section
}

/** Deletes a section and all of its content blocks. */
export async function deleteSection(sectionId) {
  const session = await requireAdmin()
  const section = await prisma.section.delete({ where: { id: sectionId } })
  await writeAudit(session.user.id, 'DELETE_SECTION', 'Section', sectionId, { sectionKey: section.sectionKey })
  return { success: true }
}

/** Persists a new order for sections in a page. */
export async function reorderSections(items) {
  const session = await requireAdmin()
  if (!Array.isArray(items)) throw new Error('items must be an array')
  await prisma.$transaction(items.map(({ id, sortOrder }) => prisma.section.update({
    where: { id },
    data: { sortOrder: Number(sortOrder), updatedById: session.user.id },
  })))
  await writeAudit(session.user.id, 'REORDER_SECTIONS', 'Section', null, { count: items.length })
  return { success: true }
}

// ─── Content Blocks ───────────────────────────────────────────────────────────

/**
 * Upserts a single content block (text or image) within a section.
 * For repeatable items (parentId set), always creates a new child block.
 *
 * @param {{
 *   sectionId: string,
 *   fieldKey: string,
 *   blockType: 'TEXT'|'RICH_TEXT'|'IMAGE'|'URL'|'SELECT',
 *   textValue?: string,
 *   mediaAssetId?: string,
 *   sortOrder?: number,
 *   parentId?: string,
 * }} data
 */
export async function upsertBlock(data) {
  const session = await requireAdmin()

  const {
    sectionId,
    fieldKey,
    blockType,
    textValue,
    mediaAssetId,
    sortOrder = 0,
    parentId = null,
  } = data

  if (!sectionId || !fieldKey || !blockType) {
    throw new Error('sectionId, fieldKey, and blockType are required')
  }

  const payload = {
    sectionId,
    fieldKey,
    blockType,
    textValue: textValue ?? null,
    mediaAssetId: mediaAssetId ?? null,
    sortOrder,
    parentId,
    updatedById: session.user.id,
  }

  // Repeatable items (parentId set) are always new rows
  if (parentId) {
    const block = await prisma.contentBlock.create({
      data: { ...payload, createdById: session.user.id },
      include: { mediaAsset: true },
    })
    await writeAudit(session.user.id, 'CREATE_BLOCK', 'ContentBlock', block.id, { fieldKey })
    return block
  }

  // Singleton fields: upsert by sectionId + fieldKey
  const existing = await prisma.contentBlock.findFirst({
    where: { sectionId, fieldKey, parentId: null },
  })

  if (existing) {
    const block = await prisma.contentBlock.update({
      where: { id: existing.id },
      data: {
        blockType,
        textValue: textValue ?? null,
        mediaAssetId: mediaAssetId ?? null,
        sortOrder,
        updatedById: session.user.id,
      },
      include: { mediaAsset: true },
    })
    await writeAudit(session.user.id, 'UPDATE_BLOCK', 'ContentBlock', block.id, { fieldKey })
    return block
  }

  const block = await prisma.contentBlock.create({
    data: { ...payload, createdById: session.user.id },
    include: { mediaAsset: true },
  })
  await writeAudit(session.user.id, 'CREATE_BLOCK', 'ContentBlock', block.id, { fieldKey })
  return block
}

/**
 * Publishes or unpublishes a content block.
 *
 * @param {string} blockId
 * @param {boolean} isPublished
 */
export async function setBlockPublished(blockId, isPublished) {
  const session = await requireAdmin()
  const block = await prisma.contentBlock.update({
    where: { id: blockId },
    data: { isPublished: Boolean(isPublished), updatedById: session.user.id },
  })
  await writeAudit(session.user.id, 'SET_BLOCK_PUBLISHED', 'ContentBlock', blockId, { isPublished })
  return block
}

/**
 * Deletes a content block (and its children via cascade).
 *
 * @param {string} blockId
 */
export async function deleteBlock(blockId) {
  const session = await requireAdmin()
  await prisma.contentBlock.delete({ where: { id: blockId } })
  await writeAudit(session.user.id, 'DELETE_BLOCK', 'ContentBlock', blockId, {})
  return { success: true }
}

/**
 * Reorders blocks within a section by updating sortOrder.
 *
 * @param {{ id: string, sortOrder: number }[]} items
 */
export async function reorderBlocks(items) {
  const session = await requireAdmin()
  await prisma.$transaction(
    items.map(({ id, sortOrder }) =>
      prisma.contentBlock.update({
        where: { id },
        data: { sortOrder, updatedById: session.user.id },
      })
    )
  )
  return { success: true }
}

/**
 * Gets all child blocks for a repeatable parent block.
 *
 * @param {string} parentId
 */
export async function getChildBlocks(parentId) {
  await requireAdmin()
  return prisma.contentBlock.findMany({
    where: { parentId },
    orderBy: { sortOrder: 'asc' },
    include: { mediaAsset: true },
  })
}

// ─── Page templates ───────────────────────────────────────────────────────────

export async function listTemplates() {
  await requireAdmin()
  return prisma.pageTemplate.findMany({ orderBy: { updatedAt: 'desc' } })
}

export async function createTemplate({ name, description, content }) {
  const session = await requireAdmin()
  if (!name?.trim()) throw new Error('Template name is required.')
  const existing = await prisma.pageTemplate.findUnique({ where: { name: name.trim() } })
  if (existing) throw new Error(`Template "${name.trim()}" already exists.`)
  return prisma.pageTemplate.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      content: content ?? { sections: [] },
    },
  })
}

/**
 * Applies a page template to a page: upserts each section spec and its
 * default blocks. Idempotent — existing blocks are updated, not duplicated.
 *
 * @param {string} templateId
 * @param {string} pageId
 */
export async function applyTemplate(templateId, pageId) {
  const session = await requireAdmin()
  const template = await prisma.pageTemplate.findUnique({ where: { id: templateId } })
  if (!template) throw new Error('Template not found.')
  const page = await prisma.page.findUnique({ where: { id: pageId } })
  if (!page) throw new Error('Page not found.')

  const specs = template.content?.sections ?? []
  for (const [i, spec] of specs.entries()) {
    if (!spec?.sectionKey) continue
    const section = await prisma.section.upsert({
      where: { pageId_sectionKey: { pageId: page.id, sectionKey: spec.sectionKey } },
      create: {
        pageId: page.id,
        sectionKey: spec.sectionKey,
        sortOrder: spec.sortOrder ?? i,
        isVisible: true,
        createdById: session.user.id,
        updatedById: session.user.id,
      },
      update: { updatedById: session.user.id },
    })
    for (const [j, b] of (spec.blocks ?? []).entries()) {
      if (!b?.fieldKey || !b?.blockType) continue
      const existing = await prisma.contentBlock.findFirst({
        where: { sectionId: section.id, fieldKey: b.fieldKey, parentId: null },
      })
      if (existing) continue
      await prisma.contentBlock.create({
        data: {
          sectionId: section.id,
          fieldKey: b.fieldKey,
          blockType: b.blockType,
          textValue: b.textValue ?? null,
          mediaAssetId: await resolveTemplateMediaId(b),
          sortOrder: b.sortOrder ?? j,
          isPublished: true,
          createdById: session.user.id,
          updatedById: session.user.id,
        },
      })
    }

    for (const [itemIndex, item] of (spec.items ?? []).entries()) {
      if (!item?.key) continue
      const fieldKey = `template:${item.key}`
      let parent = await prisma.contentBlock.findFirst({ where: { sectionId: section.id, fieldKey, parentId: null } })
      if (!parent) {
        parent = await prisma.contentBlock.create({
          data: { sectionId: section.id, fieldKey, blockType: 'TEXT', sortOrder: item.sortOrder ?? itemIndex, isPublished: true, createdById: session.user.id, updatedById: session.user.id },
        })
      }
      for (const [fieldIndex, field] of (item.fields ?? []).entries()) {
        if (!field?.fieldKey || !field?.blockType) continue
        const existing = await prisma.contentBlock.findFirst({ where: { sectionId: section.id, fieldKey: field.fieldKey, parentId: parent.id } })
        if (existing) continue
        await prisma.contentBlock.create({
          data: {
            sectionId: section.id,
            fieldKey: field.fieldKey,
            blockType: field.blockType,
            textValue: field.textValue ?? null,
            mediaAssetId: await resolveTemplateMediaId(field),
            sortOrder: field.sortOrder ?? fieldIndex,
            parentId: parent.id,
            isPublished: true,
            createdById: session.user.id,
            updatedById: session.user.id,
          },
        })
      }
    }
  }
  await writeAudit(session.user.id, 'APPLY_TEMPLATE', 'Page', page.id, { templateId, templateName: template.name })
  return getPage(page.slug)
}

async function resolveTemplateMediaId(block) {
  if (block.mediaAssetId) return block.mediaAssetId
  if (block.blockType !== 'IMAGE' || !block.textValue) return null
  const asset = await prisma.mediaAsset.findFirst({ where: { publicUrl: block.textValue }, select: { id: true } })
  return asset?.id ?? null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function writeAudit(userId, action, entityType, entityId, metadata = {}) {
  try {
    await prisma.auditLog.create({ data: { userId, action, entityType, entityId, metadata } })
  } catch (err) {
    console.error('Audit log write failed:', err)
  }
}
