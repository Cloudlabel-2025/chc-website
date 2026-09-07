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
import { getSectionTemplate } from '@/lib/cms/section-templates'

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
 * @param {{ slug: string, title: string, templateId?: string }} data
 */
export async function createPage({ slug, title, templateId }) {
  const session = await requireAdmin()

  if (!slug || !title) throw new Error('slug and title are required')
  const normalizedSlug = String(slug).toLowerCase().trim().replace(/^\/+/, '')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)) {
    const error = new Error('A page slug may use lowercase letters, numbers, and single hyphens only.')
    error.code = 'INVALID_PAGE_SLUG'
    throw error
  }

  // Validate before creating the page so an invalid/stale selector cannot
  // leave an unexpected blank page behind.
  if (templateId) {
    const template = await prisma.pageTemplate.findUnique({ where: { id: templateId }, select: { id: true } })
    if (!template) {
      const error = new Error('The selected page template no longer exists. Refresh the Pages screen and try again.')
      error.code = 'TEMPLATE_NOT_FOUND'
      throw error
    }
  }

  const page = await prisma.page.create({
    data: {
      slug: normalizedSlug,
      title: title.trim(),
      createdById: session.user.id,
      updatedById: session.user.id,
    },
  })

  await writeAudit(session.user.id, 'CREATE_PAGE', 'Page', page.id, { slug: normalizedSlug, title })
  // A page snapshot template is applied immediately, creating its sections,
  // default blocks, and repeatable-item fields in the CMS database. If that
  // import cannot complete, remove only the page created by this request so a
  // misleading blank page is never left behind.
  if (!templateId) return page
  try {
    return await applyTemplate(templateId, page.id)
  } catch (error) {
    await prisma.page.delete({ where: { id: page.id } }).catch(() => undefined)
    throw error
  }
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

/**
 * Deletes a CMS page and its related sections, blocks, and SEO metadata.
 * The home page is protected because it is the site's required root route.
 *
 * @param {string} pageId
 */
export async function deletePage(pageId) {
  const session = await requireAdmin()
  const page = await prisma.page.findUnique({ where: { id: pageId }, select: { id: true, slug: true, title: true } })
  if (!page) {
    const error = new Error('Page not found.')
    error.code = 'PAGE_NOT_FOUND'
    throw error
  }
  if (page.slug === 'home') {
    const error = new Error('The home page cannot be deleted.')
    error.code = 'PROTECTED_PAGE'
    throw error
  }

  await prisma.page.delete({ where: { id: page.id } })
  await writeAudit(session.user.id, 'DELETE_PAGE', 'Page', page.id, { slug: page.slug, title: page.title })
}

// ─── Sections ─────────────────────────────────────────────────────────────────

/**
 * Creates a section instance on a page. A section key is a reusable template
 * type, not a unique page identifier, so it may occur any number of times.
 *
 * @param {{ pageId: string, sectionKey: string, sortOrder?: number }} data
 */
export async function upsertSection({ pageId, sectionKey, sortOrder = 0 }) {
  const session = await requireAdmin()

  const section = await prisma.section.create({
    data: {
      pageId, sectionKey, sortOrder,
      createdById: session.user.id,
      updatedById: session.user.id,
    },
  })

  return section
}

/**
 * Seeds the default fields for a section added through the CMS. This is used
 * by both section APIs so pages never receive an empty shell when an editor
 * selects a reusable section type.
 */
export async function populateSectionDefaults(sectionId, sectionKey, userId) {
  const template = getSectionTemplate(sectionKey)
  if (!template) return prisma.section.findUnique({
    where: { id: sectionId }, include: { blocks: { include: { mediaAsset: true }, orderBy: { sortOrder: 'asc' } } },
  })

  for (const [index, field] of (template.defaultBlocks ?? []).entries()) {
    const existingField = await prisma.contentBlock.findFirst({
      where: { sectionId, fieldKey: field.fieldKey, parentId: null },
      select: { id: true },
    })
    if (!existingField) {
      await prisma.contentBlock.create({
        data: {
          sectionId, fieldKey: field.fieldKey, blockType: field.blockType,
          textValue: field.textValue ?? null, sortOrder: index, isPublished: true,
          createdById: userId, updatedById: userId,
        },
      })
    }
  }

  // A section with manually-created carousel cards is already populated. Only
  // add starter items when no item children exist, preventing duplicates.
  const existingChildCount = await prisma.contentBlock.count({ where: { sectionId, parentId: { not: null } } })
  if (existingChildCount === 0) {
    for (const [itemIndex, item] of (template.defaultItems ?? []).entries()) {
      const parent = await prisma.contentBlock.create({
        data: {
          sectionId, fieldKey: `template:${item.key}`, blockType: 'TEXT',
          sortOrder: itemIndex, isPublished: true, createdById: userId, updatedById: userId,
        },
      })
      for (const [fieldIndex, field] of (item.fields ?? []).entries()) {
        await prisma.contentBlock.create({
          data: {
            sectionId, fieldKey: field.fieldKey, blockType: field.blockType,
            textValue: field.textValue ?? null, parentId: parent.id, sortOrder: fieldIndex,
            isPublished: true, createdById: userId, updatedById: userId,
          },
        })
      }
    }
  }

  return prisma.section.findUnique({
    where: { id: sectionId }, include: { blocks: { include: { mediaAsset: true }, orderBy: { sortOrder: 'asc' } } },
  })
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
  const section = await prisma.section.findUnique({ where: { id: sectionId }, select: { id: true, sectionKey: true } })
  if (!section) {
    const error = new Error('Section not found.')
    error.code = 'P2025'
    throw error
  }

  // ContentBlock has a self-relation for repeatable carousel/card fields.
  // Its Prisma relation is deliberately NoAction, so remove children before
  // their parent item blocks and only then remove the containing section.
  await prisma.contentBlock.deleteMany({ where: { sectionId, parentId: { not: null } } })
  await prisma.contentBlock.deleteMany({ where: { sectionId } })
  await prisma.section.delete({ where: { id: sectionId } })
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
 * A block is uniquely identified by (sectionId, fieldKey, parentId), where
 * parentId is set for repeatable item fields and null for singleton fields.
 * Existing blocks are updated in place; new blocks are created published.
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

  const existing = await prisma.contentBlock.findFirst({
    where: { sectionId, fieldKey, parentId: parentId ?? null },
    orderBy: { updatedAt: 'desc' },
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
    data: { ...payload, createdById: session.user.id, isPublished: true },
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

/** Refreshes a reusable template without changing any pages that use it. */
export async function refreshTemplate(templateId, { description, content }) {
  const session = await requireAdmin()
  if (!templateId) throw new Error('Template ID is required.')
  const template = await prisma.pageTemplate.update({
    where: { id: templateId },
    data: {
      description: description?.trim() || null,
      content: content ?? { sections: [] },
    },
  })
  await writeAudit(session.user.id, 'REFRESH_TEMPLATE', 'PageTemplate', template.id, { name: template.name })
  return template
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
    // Applying a page layout remains idempotent: it fills the first existing
    // matching section, or creates one when the page has none. Editors can
    // still add further instances through the page editor.
    let section = await prisma.section.findFirst({
      where: { pageId: page.id, sectionKey: spec.sectionKey },
      orderBy: { sortOrder: 'asc' },
    })
    if (!section) {
      section = await prisma.section.create({
        data: {
          pageId: page.id, sectionKey: spec.sectionKey,
          sortOrder: spec.sortOrder ?? i, isVisible: true,
          createdById: session.user.id, updatedById: session.user.id,
        },
      })
    }
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
