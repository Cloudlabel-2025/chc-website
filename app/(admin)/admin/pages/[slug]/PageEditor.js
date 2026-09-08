'use client'

import { useState, useCallback } from 'react'
import MediaLibrary from '@/app/(admin)/admin/media/MediaLibrary'
import { Delete, Edit, MoveDown, MoveUp } from '@/app/(admin)/components/AdminIcons'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CharCount({ value = '', max }) {
  const len = value.length
  const cls = len > max ? 'over' : len > max * 0.85 ? 'warn' : ''
  return <p className={`admin-char-count ${cls}`}>{len}/{max}</p>
}

function Modal({ title, onClose, children, wide = false }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 24 }}>
      <div className="admin-card" style={{ maxWidth: wide ? 900 : 480, width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
        <div className="admin-card-header">
          <span className="admin-card-title">{title}</span>
          <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="admin-card-body">{children}</div>
      </div>
    </div>
  )
}

// ─── Block field editor ───────────────────────────────────────────────────────

function BlockField({ sectionId, block, fieldKey, blockType, label, maxLength, required, options, parentId, onSaved }) {
  const [value, setValue]   = useState(block?.textValue ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [err, setErr]       = useState('')
  const [showPicker, setShowPicker] = useState(false)

  const isImage = blockType === 'IMAGE'
  const asset   = block?.mediaAsset ?? null
  // Existing content may use an older icon class. Keep it selectable so
  // opening the editor never silently replaces a saved icon.
  const selectOptions = options?.some((option) => option.value === value)
    ? options
    : options ? [{ value, label: `Current icon — ${value || 'not set'}` }, ...options] : []

  async function save() {
    setSaving(true)
    setErr('')
    try {
      const res = await fetch(
        `/api/admin/pages/${window.__pageSlug}/sections/${sectionId}/blocks`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fieldKey, blockType, textValue: isImage ? null : value, parentId: parentId ?? null }),
        }
      )
      const data = await res.json()
      if (!res.ok) { setErr(data.error ?? 'Save failed'); return }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      onSaved?.(data.block)
    } catch { setErr('Network error') }
    finally { setSaving(false) }
  }

  async function pickMedia(asset) {
    setSaving(true)
    setErr('')
    try {
      const res = await fetch(
        `/api/admin/pages/${window.__pageSlug}/sections/${sectionId}/blocks`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fieldKey, blockType: 'IMAGE', mediaAssetId: asset.id, parentId: parentId ?? null }),
        }
      )
      const data = await res.json()
      if (!res.ok) { setErr(data.error ?? 'Save failed'); return }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      onSaved?.(data.block)
    } catch { setErr('Network error') }
    finally { setSaving(false); setShowPicker(false) }
  }

  return (
    <div className="admin-form-group">
      <label className="admin-label">
        {label}
        {required && <span className="admin-label-required" />}
      </label>

      {isImage ? (
        <div className="admin-image-picker" onClick={() => setShowPicker(true)}>
          {asset
            ? <img src={asset.publicUrl} alt={asset.altText || label} className="admin-image-picker-thumb" />
            : <div className="admin-image-picker-placeholder">🖼</div>
          }
          <div>
            <p style={{ fontSize: 13, fontWeight: 600 }}>{asset ? asset.filename : 'Click to select image'}</p>
            {asset && <p className="admin-text-muted admin-text-sm">{asset.width}×{asset.height}px</p>}
            <p className="admin-text-muted admin-text-sm" style={{ marginTop: 2 }}>Click to change</p>
          </div>
        </div>
      ) : options?.length ? (
        <select
          className="admin-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        >
          {selectOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : maxLength > 120 ? (
        <>
          <textarea
            className="admin-textarea"
            value={value}
            maxLength={maxLength}
            onChange={(e) => setValue(e.target.value)}
            rows={4}
          />
          <CharCount value={value} max={maxLength} />
        </>
      ) : (
        <>
          <input
            className="admin-input"
            value={value}
            maxLength={maxLength}
            onChange={(e) => setValue(e.target.value)}
          />
          {maxLength && <CharCount value={value} max={maxLength} />}
        </>
      )}

      {err && <p className="admin-field-error">{err}</p>}

      {!isImage && (
        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
          <button
            className="admin-btn admin-btn-primary admin-btn-sm"
            onClick={save}
            disabled={saving}
          >
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save'}
          </button>
        </div>
      )}

      {showPicker && (
        <Modal title="Select image" onClose={() => setShowPicker(false)} wide>
          <MediaLibrary selectionMode onSelect={pickMedia} />
        </Modal>
      )}
    </div>
  )
}

// ─── Repeatable item editor ───────────────────────────────────────────────────

function itemTitle(item, children) {
  const first = ['name', 'title', 'heading', 'label', 'question'].map((k) =>
    children.find((c) => c.fieldKey === k)?.textValue
  ).find(Boolean)
  return first || `Item ${item.sortOrder + 1}`
}

function RepeatableItemEditor({ sectionId, slug, sectionKey, initialBlocks = [], sectionFields = [] }) {
  const fieldDefs = REPEATABLE_FIELDS[sectionKey] ?? []
  const [allBlocks, setAllBlocks] = useState(initialBlocks)
  const [expandedId, setExpandedId] = useState(null)
  const [adding, setAdding]         = useState(false)
  const [deleting, setDeleting]     = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [err, setErr]               = useState('')

  const items = allBlocks
    // Section fields (for example, sectionHeading) are not carousel cards.
    // Only the remaining top-level blocks represent repeatable items.
    .filter((b) => !b.parentId && !sectionFields.some((field) => field.fieldKey === b.fieldKey))
    .sort((a, b) => a.sortOrder - b.sortOrder)
  const childrenOf = (id) => allBlocks.filter((b) => b.parentId === id)

  function handleChildSaved(newBlock) {
    setAllBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === newBlock.id)
      if (idx >= 0) return prev.map((b, i) => (i === idx ? newBlock : b))
      return [...prev, newBlock]
    })
  }

  async function handleAddItem() {
    setAdding(true)
    setErr('')
    try {
      const res = await fetch(`/api/admin/pages/${slug}/sections/${sectionId}/blocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldKey: 'item',
          blockType: 'TEXT',
          textValue: '',
          sortOrder: items.length,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setErr(data.error ?? 'Failed to add item.'); return }
      setAllBlocks((prev) => [...prev, data.block, ...(data.children ?? [])])
      setExpandedId(data.block.id)
    } catch { setErr('Network error — item not added.') }
    finally { setAdding(false) }
  }

  async function executeDelete(item) {
    setDeleting(true)
    setErr('')
    try {
      // NoAction FK: delete children first, then the parent row
      const kids = childrenOf(item.id)
      for (const kid of kids) {
        await fetch(`/api/admin/pages/${slug}/sections/${sectionId}/blocks/${kid.id}`, { method: 'DELETE' })
      }
      const res = await fetch(`/api/admin/pages/${slug}/sections/${sectionId}/blocks/${item.id}`, { method: 'DELETE' })
      if (!res.ok) { setErr('Failed to delete item.'); return }
      const gone = new Set([item.id, ...kids.map((k) => k.id)])
      setAllBlocks((prev) => prev.filter((b) => !gone.has(b.id)))
      setDeleteConfirmId(null)
      if (expandedId === item.id) setExpandedId(null)
    } catch { setErr('Network error — item not deleted.') }
    finally { setDeleting(false) }
  }

  return (
    <div>
      {sectionFields.length > 0 && (
        <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--admin-border)' }}>
          {sectionFields.map((f) => {
            const blk = allBlocks.find((b) => !b.parentId && b.fieldKey === f.fieldKey) ?? null
            return (
              <BlockField
                key={f.fieldKey}
                sectionId={sectionId}
                block={blk}
                {...f}
                onSaved={handleChildSaved}
              />
            )
          })}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span className="admin-text-sm admin-text-muted">{items.length} item{items.length !== 1 ? 's' : ''}</span>
        <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={handleAddItem} disabled={adding}>
          {adding ? 'Adding…' : '+ Add Item'}
        </button>
      </div>

      {err && <div className="admin-alert admin-alert-error admin-mb-16">{err}</div>}

      {items.length === 0 && (
        <p className="admin-text-muted admin-text-sm">No items yet. Click “+ Add Item” to create the first one.</p>
      )}

      {items.map((item) => {
        const kids = childrenOf(item.id)
        const expanded = expandedId === item.id
        return (
          <div key={item.id} className="admin-card admin-mb-16" style={{ border: '1px solid var(--admin-border)' }}>
            <div
              className="admin-card-header"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              onClick={() => setExpandedId(expanded ? null : item.id)}
            >
              <span className="admin-card-title" style={{ fontSize: 13 }}>{itemTitle(item, kids)}</span>
              <span style={{ display: 'flex', gap: 8 }} onClick={(e) => e.stopPropagation()}>
                <button
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => setExpandedId(expanded ? null : item.id)}
                >
                  {expanded ? 'Collapse' : 'Edit'}
                </button>
                {deleteConfirmId === item.id ? (
                  <>
                    <button
                      className="admin-btn admin-btn-sm"
                      style={{ background: 'var(--admin-danger)', color: '#fff' }}
                      onClick={() => executeDelete(item)}
                      disabled={deleting}
                    >
                      {deleting ? 'Deleting…' : 'Confirm'}
                    </button>
                    <button
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={() => setDeleteConfirmId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => setDeleteConfirmId(item.id)}
                  >
                    Delete
                  </button>
                )}
              </span>
            </div>
            {expanded && (
              <div className="admin-card-body">
                {fieldDefs.map((f) => {
                  const blk = kids.find((c) => c.fieldKey === f.fieldKey) ?? null
                  return (
                    <BlockField
                      key={f.fieldKey}
                      sectionId={sectionId}
                      block={blk}
                      parentId={item.id}
                      {...f}
                      onSaved={handleChildSaved}
                    />
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Section panel ────────────────────────────────────────────────────────────

const SECTION_FIELDS = {
  hero: [
    { fieldKey: 'backgroundImage', blockType: 'IMAGE',   label: 'Background image',  required: true },
    { fieldKey: 'badge',           blockType: 'TEXT',    label: 'Badge text',         maxLength: 60,  required: true },
    { fieldKey: 'heading',         blockType: 'TEXT',    label: 'Heading (h1)',        maxLength: 80,  required: true },
    { fieldKey: 'paragraph',       blockType: 'TEXT',    label: 'Paragraph',           maxLength: 500, required: true },
    { fieldKey: 'cta1Label',       blockType: 'TEXT',    label: 'CTA 1 label',         maxLength: 30 },
    { fieldKey: 'cta1Href',        blockType: 'URL',     label: 'CTA 1 URL',           maxLength: 200 },
    { fieldKey: 'cta2Label',       blockType: 'TEXT',    label: 'CTA 2 label',         maxLength: 30 },
    { fieldKey: 'cta2Href',        blockType: 'URL',     label: 'CTA 2 URL',           maxLength: 200 },
  ],
  intro: [
    { fieldKey: 'leftImage',  blockType: 'IMAGE', label: 'Left image',  required: true },
    { fieldKey: 'rightImage', blockType: 'IMAGE', label: 'Right image', required: true },
    { fieldKey: 'badge',      blockType: 'TEXT',  label: 'Badge text',  maxLength: 60,  required: true },
    { fieldKey: 'heading',    blockType: 'TEXT',  label: 'Heading',     maxLength: 80,  required: true },
    { fieldKey: 'paragraph',  blockType: 'TEXT',  label: 'Paragraph',   maxLength: 400, required: true },
    { fieldKey: 'buttonLabel', blockType: 'TEXT', label: 'Primary button label', maxLength: 50 },
    { fieldKey: 'buttonHref',  blockType: 'URL',  label: 'Primary button URL',   maxLength: 200 },
    { fieldKey: 'linkLabel',   blockType: 'TEXT', label: 'Secondary link label', maxLength: 50 },
    { fieldKey: 'linkHref',    blockType: 'URL',  label: 'Secondary link URL',   maxLength: 200 },
    { fieldKey: 'note',        blockType: 'TEXT', label: 'Supporting note',      maxLength: 160 },
  ],
  contentSection: [
    { fieldKey: 'leftImage',  blockType: 'IMAGE', label: 'Left image',  required: true },
    { fieldKey: 'rightImage', blockType: 'IMAGE', label: 'Right image', required: true },
    { fieldKey: 'badge',      blockType: 'TEXT',  label: 'Badge text',  maxLength: 60,  required: true },
    { fieldKey: 'heading',    blockType: 'TEXT',  label: 'Heading',     maxLength: 80,  required: true },
    { fieldKey: 'paragraph',  blockType: 'TEXT',  label: 'Paragraph',   maxLength: 400, required: true },
  ],
  innerPageHero: [
    { fieldKey: 'backgroundImage', blockType: 'IMAGE', label: 'Background image', required: true },
    { fieldKey: 'heading',         blockType: 'TEXT',  label: 'Page heading (h1)', maxLength: 60, required: true },
    { fieldKey: 'subtitle',        blockType: 'TEXT',  label: 'Subtitle',          maxLength: 200 },
  ],
  contact: [
    { fieldKey: 'officeLabel',   blockType: 'TEXT', label: 'Office label',    maxLength: 40 },
    { fieldKey: 'officeAddress', blockType: 'TEXT', label: 'Office address',  maxLength: 200 },
    { fieldKey: 'phoneLabel',    blockType: 'TEXT', label: 'Phone label',     maxLength: 40 },
    { fieldKey: 'phone',         blockType: 'TEXT', label: 'Phone',           maxLength: 30 },
    { fieldKey: 'faxLabel',      blockType: 'TEXT', label: 'Fax label',       maxLength: 40 },
    { fieldKey: 'fax',           blockType: 'TEXT', label: 'Fax',             maxLength: 30 },
    { fieldKey: 'emailLabel',    blockType: 'TEXT', label: 'Email label',     maxLength: 40 },
    { fieldKey: 'email1',        blockType: 'TEXT', label: 'Primary email',   maxLength: 100 },
    { fieldKey: 'email2',        blockType: 'TEXT', label: 'Secondary email', maxLength: 100 },
    { fieldKey: 'mapLat',        blockType: 'TEXT', label: 'Map latitude',    maxLength: 20 },
    { fieldKey: 'mapLng',        blockType: 'TEXT', label: 'Map longitude',   maxLength: 20 },
    { fieldKey: 'mapPopupHtml',  blockType: 'TEXT', label: 'Map popup text',  maxLength: 200 },
  ],
  giveOneHour: [
    { fieldKey: 'sectionHeading',    blockType: 'TEXT', label: 'Section heading',    maxLength: 100, required: true },
    { fieldKey: 'sectionSubheading', blockType: 'TEXT', label: 'Section subheading', maxLength: 150 },
  ],
  deliveryCapacity: [
    { fieldKey: 'heading',   blockType: 'TEXT', label: 'Section heading',   maxLength: 100, required: true },
    { fieldKey: 'paragraph', blockType: 'TEXT', label: 'Section paragraph', maxLength: 500, required: true },
  ],
  ctaBanner: [
    { fieldKey: 'heading',     blockType: 'TEXT', label: 'Banner heading',  maxLength: 100 },
    { fieldKey: 'paragraph',   blockType: 'TEXT', label: 'Banner text',     maxLength: 200 },
    { fieldKey: 'buttonLabel', blockType: 'TEXT', label: 'Button label',    maxLength: 40 },
    { fieldKey: 'buttonHref',  blockType: 'URL',  label: 'Button URL',      maxLength: 200 },
  ],
  peopleHeader: [
    { fieldKey: 'badge',   blockType: 'TEXT', label: 'Eyebrow badge',   maxLength: 40 },
    { fieldKey: 'heading', blockType: 'TEXT', label: 'Section heading', maxLength: 80 },
  ],
  faqHeader: [
    { fieldKey: 'eyebrow', blockType: 'TEXT', label: 'Eyebrow',         maxLength: 40 },
    { fieldKey: 'heading', blockType: 'TEXT', label: 'Section heading', maxLength: 80 },
  ],
  faqFooter: [
    { fieldKey: 'text',  blockType: 'TEXT', label: 'Footer text',  maxLength: 120 },
    { fieldKey: 'label', blockType: 'TEXT', label: 'Link label',   maxLength: 40 },
    { fieldKey: 'href',  blockType: 'URL',  label: 'Link URL',     maxLength: 200 },
  ],
  processHeader2: [
    { fieldKey: 'heading', blockType: 'TEXT', label: 'Section heading', maxLength: 100 },
  ],
  impactHeader: [
    { fieldKey: 'badge',   blockType: 'TEXT', label: 'Eyebrow badge',   maxLength: 40 },
    { fieldKey: 'heading', blockType: 'TEXT', label: 'Section heading', maxLength: 80 },
  ],
  impactFooter: [
    { fieldKey: 'note', blockType: 'TEXT', label: 'Footer note', maxLength: 200 },
  ],
  homeStackHeader: [
    { fieldKey: 'eyebrow', blockType: 'TEXT', label: 'Eyebrow',         maxLength: 40 },
    { fieldKey: 'heading', blockType: 'TEXT', label: 'Section heading', maxLength: 80 },
  ],
  oracleHeadings: [
    { fieldKey: 'capabilitiesHeading', blockType: 'TEXT', label: 'Capabilities heading',  maxLength: 60 },
    { fieldKey: 'servicesEyebrow',     blockType: 'TEXT', label: 'Services eyebrow',      maxLength: 40 },
    { fieldKey: 'servicesHeading',     blockType: 'TEXT', label: 'Services heading',      maxLength: 60 },
    { fieldKey: 'exploreLabel',        blockType: 'TEXT', label: 'Carousel button label', maxLength: 30 },
  ],
  contactForm: [
    { fieldKey: 'formBadge',      blockType: 'TEXT', label: 'Form badge',      maxLength: 48 },
    { fieldKey: 'heading',        blockType: 'TEXT', label: 'Form heading',    maxLength: 80 },
    { fieldKey: 'paragraph',      blockType: 'TEXT', label: 'Form paragraph',  maxLength: 300 },
    { fieldKey: 'submitLabel',    blockType: 'TEXT', label: 'Submit button label', maxLength: 48 },
    { fieldKey: 'successMessage', blockType: 'TEXT', label: 'Success message', maxLength: 200 },
  ],
  giveOneHourForm: [
    { fieldKey: 'formBadge',      blockType: 'TEXT', label: 'Form badge',      maxLength: 48 },
    { fieldKey: 'heading',        blockType: 'TEXT', label: 'Form heading',    maxLength: 80 },
    { fieldKey: 'paragraph',      blockType: 'TEXT', label: 'Form paragraph',  maxLength: 300 },
    { fieldKey: 'successMessage', blockType: 'TEXT', label: 'Success message', maxLength: 200 },
  ],
  newsletterForm: [
    { fieldKey: 'heading',        blockType: 'TEXT', label: 'Form heading',    maxLength: 80 },
    { fieldKey: 'placeholder',    blockType: 'TEXT', label: 'Placeholder',     maxLength: 60 },
    { fieldKey: 'successMessage', blockType: 'TEXT', label: 'Success message', maxLength: 200 },
  ],
  richText: [
    { fieldKey: 'sectionHeading', blockType: 'TEXT',      label: 'Section heading', maxLength: 100, required: true },
    { fieldKey: 'content',        blockType: 'RICH_TEXT', label: 'Content',         maxLength: 5000, required: true },
  ],
}

// ─── Repeatable item field definitions (per-card fields, Class D) ────────────

const PROCESS_ICON_OPTIONS = [
  { value: 'line-icon-Computer', label: 'Technology — Computer' },
  { value: 'line-icon-Laptop', label: 'Technology — Laptop' },
  { value: 'line-icon-Monitor', label: 'Technology — Monitor' },
  { value: 'line-icon-Server', label: 'Technology — Server' },
  { value: 'line-icon-Cloud', label: 'Technology — Cloud' },
  { value: 'line-icon-Network', label: 'Technology — Network' },
  { value: 'line-icon-Wifi', label: 'Technology — Connectivity' },
  { value: 'line-icon-Gear', label: 'Technology — Configuration' },
  { value: 'line-icon-Light-Bulb', label: 'Innovation — Light bulb' },
  { value: 'line-icon-Idea-5', label: 'Innovation — Idea' },
  { value: 'line-icon-Idea', label: 'Innovation — Idea (alternate)' },
  { value: 'line-icon-Rocket', label: 'Delivery — Rocket' },
  { value: 'line-icon-Target', label: 'Delivery — Target' },
  { value: 'line-icon-Bar-Chart', label: 'Delivery — Performance' },
  { value: 'line-icon-Check', label: 'Quality — Check' },
  { value: 'line-icon-Shield', label: 'Quality — Shield' },
  { value: 'line-icon-Medal', label: 'Leadership — Medal' },
  { value: 'line-icon-User', label: 'Leadership — People' },
  { value: 'line-icon-Headset', label: 'Leadership — Support' },
  { value: 'line-icon-Brain', label: 'Learning — Knowledge' },
  { value: 'line-icon-Book', label: 'Learning — Book' },
]

const REPEATABLE_FIELDS = {
  whatWeDo: [
    { fieldKey: 'image',       blockType: 'IMAGE', label: 'Card image',       required: true },
    { fieldKey: 'title',       blockType: 'TEXT',  label: 'Card title',       maxLength: 60,  required: true },
    { fieldKey: 'description', blockType: 'TEXT',  label: 'Card description', maxLength: 200, required: true },
    { fieldKey: 'href',        blockType: 'URL',   label: 'Card link URL',    maxLength: 200 },
  ],
  whyChc: [
    { fieldKey: 'image',     blockType: 'IMAGE', label: 'Card image',     required: true },
    { fieldKey: 'heading',   blockType: 'TEXT',  label: 'Card heading',   maxLength: 80,  required: true },
    { fieldKey: 'paragraph', blockType: 'TEXT',  label: 'Card paragraph', maxLength: 300, required: true },
  ],
  featureCards: [
    { fieldKey: 'image',     blockType: 'IMAGE', label: 'Card icon/image', required: true },
    { fieldKey: 'title',     blockType: 'TEXT',  label: 'Card title',      maxLength: 60,  required: true },
    { fieldKey: 'paragraph', blockType: 'TEXT',  label: 'Card paragraph',  maxLength: 300, required: true },
    { fieldKey: 'href',      blockType: 'URL',   label: 'Card link URL',   maxLength: 200 },
  ],
  capabilityItem: [
    { fieldKey: 'icon',  blockType: 'IMAGE', label: 'Capability icon',      required: true },
    { fieldKey: 'label', blockType: 'TEXT',  label: 'Capability label',     maxLength: 40, required: true },
    { fieldKey: 'href',  blockType: 'URL',   label: 'Link URL (optional)',  maxLength: 200 },
  ],
  productisedService: [
    { fieldKey: 'image',            blockType: 'IMAGE', label: 'Service image',     required: true },
    { fieldKey: 'title',            blockType: 'TEXT',  label: 'Service title',     maxLength: 80,  required: true },
    { fieldKey: 'hoverDescription', blockType: 'TEXT',  label: 'Hover description', maxLength: 300, required: true },
    { fieldKey: 'ctaText',          blockType: 'TEXT',  label: 'CTA text',          maxLength: 60,  required: true },
    { fieldKey: 'ctaHref',          blockType: 'URL',   label: 'CTA link URL',      maxLength: 200 },
  ],
  serviceCarouselItem: [
    { fieldKey: 'image',       blockType: 'IMAGE', label: 'Slide image',       required: true },
    { fieldKey: 'title',       blockType: 'TEXT',  label: 'Slide title',       maxLength: 60,  required: true },
    { fieldKey: 'description', blockType: 'TEXT',  label: 'Slide description', maxLength: 300, required: true },
    { fieldKey: 'href',        blockType: 'URL',   label: 'Slide link URL',    maxLength: 200 },
  ],
  serviceSlide: [
    { fieldKey: 'image',       blockType: 'IMAGE', label: 'Slide icon/image',  required: true },
    { fieldKey: 'title',       blockType: 'TEXT',  label: 'Slide title',       maxLength: 60,  required: true },
    { fieldKey: 'description', blockType: 'TEXT',  label: 'Slide description', maxLength: 300, required: true },
    { fieldKey: 'href',        blockType: 'URL',   label: 'Slide link URL',    maxLength: 200 },
  ],
  teamMember: [
    { fieldKey: 'photo',         blockType: 'IMAGE', label: 'Photo',                    required: true },
    { fieldKey: 'name',          blockType: 'TEXT',  label: 'Name',                     maxLength: 80,  required: true },
    { fieldKey: 'role',          blockType: 'TEXT',  label: 'Role / title',             maxLength: 80,  required: true },
    { fieldKey: 'capability',    blockType: 'TEXT',  label: 'Capability area',          maxLength: 100 },
    { fieldKey: 'learningFocus', blockType: 'TEXT',  label: 'Learning / delivery focus', maxLength: 150 },
  ],
  stackCards1: [
    { fieldKey: 'image',     blockType: 'IMAGE', label: 'Card image',     required: true },
    { fieldKey: 'badge',     blockType: 'TEXT',  label: 'Badge label',    maxLength: 60 },
    { fieldKey: 'heading',   blockType: 'TEXT',  label: 'Card heading',   maxLength: 80,  required: true },
    { fieldKey: 'paragraph', blockType: 'TEXT',  label: 'Card paragraph', maxLength: 300, required: true },
  ],
  stackCards2: [
    { fieldKey: 'image',     blockType: 'IMAGE', label: 'Card image',     required: true },
    { fieldKey: 'badge',     blockType: 'TEXT',  label: 'Badge label',    maxLength: 60 },
    { fieldKey: 'heading',   blockType: 'TEXT',  label: 'Card heading',   maxLength: 80,  required: true },
    { fieldKey: 'paragraph', blockType: 'TEXT',  label: 'Card paragraph', maxLength: 300, required: true },
  ],
  stackCards3: [
    { fieldKey: 'image',     blockType: 'IMAGE', label: 'Card image',     required: true },
    { fieldKey: 'badge',     blockType: 'TEXT',  label: 'Badge label',    maxLength: 60 },
    { fieldKey: 'heading',   blockType: 'TEXT',  label: 'Card heading',   maxLength: 80,  required: true },
    { fieldKey: 'paragraph', blockType: 'TEXT',  label: 'Card paragraph', maxLength: 300, required: true },
  ],
  processSteps1: [
    { fieldKey: 'icon',        blockType: 'TEXT', label: 'Process icon', options: PROCESS_ICON_OPTIONS, required: true },
    { fieldKey: 'label',       blockType: 'TEXT', label: 'Step label',               maxLength: 60,  required: true },
    { fieldKey: 'description', blockType: 'TEXT', label: 'Step description',         maxLength: 200, required: true },
  ],
  processSteps2: [
    { fieldKey: 'icon',        blockType: 'TEXT', label: 'Process icon', options: PROCESS_ICON_OPTIONS, required: true },
    { fieldKey: 'label',       blockType: 'TEXT', label: 'Step label',               maxLength: 60,  required: true },
    { fieldKey: 'description', blockType: 'TEXT', label: 'Step description',         maxLength: 200, required: true },
  ],
  faqItem: [
    { fieldKey: 'question', blockType: 'TEXT', label: 'Question', maxLength: 150, required: true },
    { fieldKey: 'answer',   blockType: 'TEXT', label: 'Answer',   maxLength: 500, required: true },
  ],
}

const REPEATABLE_SECTION_FIELDS = {
  whatWeDo: [{ fieldKey: 'sectionHeading', blockType: 'TEXT', label: 'Section heading', maxLength: 80 }],
  whyChc: [{ fieldKey: 'sectionHeading', blockType: 'TEXT', label: 'Section heading', maxLength: 80 }],
  featureCards: [{ fieldKey: 'sectionHeading', blockType: 'TEXT', label: 'Section heading', maxLength: 100 }],
  capabilityItem: [{ fieldKey: 'sectionHeading', blockType: 'TEXT', label: 'Section heading', maxLength: 100 }],
  productisedService: [{ fieldKey: 'sectionHeading', blockType: 'TEXT', label: 'Section heading', maxLength: 100 }],
  serviceCarouselItem: [{ fieldKey: 'sectionHeading', blockType: 'TEXT', label: 'Section heading', maxLength: 100 }],
  serviceSlide: [
    { fieldKey: 'sectionBadge', blockType: 'TEXT', label: 'Eyebrow badge', maxLength: 60 },
    { fieldKey: 'sectionHeading', blockType: 'TEXT', label: 'Section heading', maxLength: 100 },
  ],
  teamMember: [{ fieldKey: 'sectionHeading', blockType: 'TEXT', label: 'Section heading', maxLength: 100 }],
  stackCards1: [{ fieldKey: 'sectionHeading', blockType: 'TEXT', label: 'Section heading', maxLength: 100 }],
  stackCards2: [{ fieldKey: 'sectionHeading', blockType: 'TEXT', label: 'Section heading', maxLength: 100 }],
  stackCards3: [{ fieldKey: 'sectionHeading', blockType: 'TEXT', label: 'Section heading', maxLength: 100 }],
  processSteps1: [{ fieldKey: 'sectionHeading', blockType: 'TEXT', label: 'Section heading', maxLength: 100 }],
  processSteps2: [{ fieldKey: 'sectionHeading', blockType: 'TEXT', label: 'Section heading', maxLength: 100 }],
  faqItem: [
    { fieldKey: 'sectionBadge', blockType: 'TEXT', label: 'Eyebrow badge', maxLength: 60 },
    { fieldKey: 'sectionHeading', blockType: 'TEXT', label: 'Section heading', maxLength: 100 },
  ],
}

// ─── Add-section library (sectionKey → label + default animation) ────────────

const SECTION_LIBRARY = [
  { key: 'hero', label: 'Hero banner', animation: 'hero' },
  { key: 'innerPageHero', label: 'Inner page hero', animation: 'fadeIn' },
  { key: 'intro', label: 'Image + intro content', animation: 'fadeIn' },
  { key: 'contentSection', label: 'Image + content section', animation: 'fadeIn' },
  { key: 'whatWeDo', label: 'What we do cards', animation: 'slideIn' },
  { key: 'whyChc', label: 'Why CHC cards', animation: 'stack' },
  { key: 'featureCards', label: 'Feature cards', animation: 'fadeIn' },
  { key: 'capabilityItem', label: 'Capabilities carousel', animation: 'fadeIn' },
  { key: 'productisedService', label: 'Productised services', animation: 'fadeIn' },
  { key: 'deliveryCapacity', label: 'Delivery capacity', animation: 'fadeIn' },
  { key: 'serviceCarouselItem', label: 'Service carousel', animation: 'fadeIn' },
  { key: 'serviceSlide', label: 'Impact service slides', animation: 'fadeIn' },
  { key: 'stackCards1', label: 'Stack cards group 1', animation: 'stack' },
  { key: 'stackCards2', label: 'Stack cards group 2', animation: 'stack' },
  { key: 'stackCards3', label: 'Stack cards group 3', animation: 'stack' },
  { key: 'processSteps1', label: 'Process steps', animation: 'slideIn' },
  { key: 'processSteps2', label: 'Process steps (extended)', animation: 'slideIn' },
  { key: 'faqItem', label: 'FAQ cards', animation: 'flipIn' },
  { key: 'teamMember', label: 'People carousel', animation: 'fadeIn' },
  { key: 'contact', label: 'Contact details', animation: 'fadeIn' },
  { key: 'contactForm', label: 'Contact form copy', animation: 'fadeIn' },
  { key: 'oracleHeadings', label: 'Oracle HCM headings & labels', animation: 'fadeIn' },
  { key: 'ctaBanner', label: 'CTA banner', animation: 'fadeIn' },
  { key: 'peopleHeader', label: 'People section header', animation: 'fadeIn' },
  { key: 'faqHeader', label: 'FAQ header', animation: 'fadeIn' },
  { key: 'faqFooter', label: 'FAQ footer link', animation: 'fadeIn' },
  { key: 'processHeader2', label: 'Process section header', animation: 'fadeIn' },
  { key: 'impactHeader', label: 'Impact section header', animation: 'fadeIn' },
  { key: 'impactFooter', label: 'Impact footer note', animation: 'fadeIn' },
  { key: 'homeStackHeader', label: 'Homepage stack header', animation: 'fadeIn' },
  { key: 'giveOneHour', label: 'Give one hour intro', animation: 'fadeIn' },
  { key: 'giveOneHourForm', label: 'Give One Hour form copy', animation: 'fadeIn' },
  { key: 'newsletterForm', label: 'Newsletter form copy', animation: 'fadeIn' },
  { key: 'richText', label: 'Rich text content', animation: 'fadeIn' },
]

function SectionPanel({ section, slug, index, total, onMove, onDelete }) {
  const [open, setOpen]     = useState(true)
  const [blocks, setBlocks] = useState(section.blocks ?? [])
  const [visible, setVisible] = useState(section.isVisible)
  const [toggling, setToggling] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [restoreError, setRestoreError] = useState('')

  const fields = SECTION_FIELDS[section.sectionKey] ?? []
  const repFields = REPEATABLE_FIELDS[section.sectionKey] ?? null
  const repSectionFields = REPEATABLE_SECTION_FIELDS[section.sectionKey] ?? []

  function getBlock(fieldKey) {
    return blocks.find((b) => b.fieldKey === fieldKey) ?? null
  }

  function handleSaved(newBlock) {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.fieldKey === newBlock.fieldKey && !b.parentId)
      return idx >= 0
        ? prev.map((b, i) => i === idx ? newBlock : b)
        : [...prev, newBlock]
    })
  }

  async function toggleVisibility() {
    setToggling(true)
    try {
      await fetch(`/api/admin/pages/${slug}/sections/${section.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !visible }),
      })
      setVisible((v) => !v)
    } finally { setToggling(false) }
  }

  async function restoreDefaults() {
    setRestoring(true)
    setRestoreError('')
    try {
      const response = await fetch(`/api/admin/pages/${slug}/sections/${section.id}`, { method: 'POST' })
      const data = await response.json()
      if (!response.ok) { setRestoreError(data.error ?? 'Could not restore default content.'); return }
      setBlocks(data.section?.blocks ?? [])
      setOpen(true)
    } catch { setRestoreError('Network error — default content was not restored.') }
    finally { setRestoring(false) }
  }

  return (
    <div className="admin-card admin-mb-16">
      <div className="admin-section-header" onClick={() => setOpen((o) => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'capitalize' }}>
            {section.sectionKey}
          </span>
          {!visible && <span className="admin-badge admin-badge-locked">Hidden</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} onClick={(e) => e.stopPropagation()}>
          <label className="admin-toggle" title={visible ? 'Hide section' : 'Show section'}>
            <input type="checkbox" checked={visible} onChange={toggleVisibility} disabled={toggling} />
            <span className="admin-toggle-track" />
            <span className="admin-text-sm admin-text-muted">{visible ? 'Visible' : 'Hidden'}</span>
          </label>
          {(fields.length > 0 || repFields) && <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={restoreDefaults} disabled={restoring} title="Add only the missing default fields and items; existing edits are kept">{restoring ? 'Restoring…' : 'Restore defaults'}</button>}
          <button type="button" className="admin-btn admin-btn-icon admin-btn-secondary" onClick={() => setOpen(true)} aria-label={`Edit ${section.sectionKey}`} title="Edit section"><Edit size={15} /></button>
          <button type="button" className="admin-btn admin-btn-icon admin-btn-ghost" onClick={() => onMove(section.id, -1)} disabled={index === 0} aria-label={`Move ${section.sectionKey} up`} title="Move up"><MoveUp size={15} /></button>
          <button type="button" className="admin-btn admin-btn-icon admin-btn-ghost" onClick={() => onMove(section.id, 1)} disabled={index === total - 1} aria-label={`Move ${section.sectionKey} down`} title="Move down"><MoveDown size={15} /></button>
          <button type="button" className="admin-btn admin-btn-icon admin-btn-ghost admin-navigation-delete" onClick={() => onDelete(section)} aria-label={`Delete ${section.sectionKey}`} title="Delete section"><Delete size={15} /></button>
          <span className={`admin-section-chevron ${open ? 'open' : ''}`}>▾</span>
        </div>
      </div>

      {open && (
        <div className="admin-card-body">
          {repFields ? (
            <RepeatableItemEditor
              key={`${section.id}-${blocks.length}`}
              sectionId={section.id}
              slug={slug}
              sectionKey={section.sectionKey}
              initialBlocks={blocks}
              sectionFields={repSectionFields}
            />
          ) : fields.length === 0 ? (
            <p className="admin-text-muted admin-text-sm">
              No editable fields configured for this section type.
            </p>
          ) : (
            fields.map((f) => (
              <BlockField
                key={f.fieldKey}
                sectionId={section.id}
                block={getBlock(f.fieldKey)}
                {...f}
                onSaved={handleSaved}
              />
            ))
          )}
          {restoreError && <p className="admin-field-error">{restoreError}</p>}
        </div>
      )}
    </div>
  )
}

// ─── Main PageEditor ──────────────────────────────────────────────────────────

export default function PageEditor({ page, slug }) {
  const [tab, setTab]             = useState('content')
  const [published, setPublished] = useState(page.isPublished)
  const [toggling, setToggling]   = useState(false)
  const [pubMsg, setPubMsg]       = useState('')
  const [sections, setSections]   = useState(page.sections ?? [])
  const [sectionToAdd, setSectionToAdd] = useState('')
  const [sectionSearch, setSectionSearch] = useState('')
  const [addingSection, setAddingSection] = useState(false)
  const [addErr, setAddErr]       = useState('')
  const [movingSection, setMovingSection] = useState('')
  const [sectionToDelete, setSectionToDelete] = useState(null)
  const [deletingSection, setDeletingSection] = useState(false)

  // Inject slug for BlockField fetch URLs
  if (typeof window !== 'undefined') window.__pageSlug = slug

  async function togglePublish() {
    setToggling(true)
    setPubMsg('')
    try {
      const res = await fetch(`/api/admin/pages/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !published }),
      })
      if (res.ok) {
        setPublished((p) => !p)
        setPubMsg(!published ? 'Page published.' : 'Page set to draft.')
        setTimeout(() => setPubMsg(''), 3000)
      }
    } finally { setToggling(false) }
  }

  async function addSection() {
    if (!sectionToAdd) return
    const lib = SECTION_LIBRARY.find((s) => s.key === sectionToAdd)
    if (!lib) return
    setAddingSection(true)
    setAddErr('')
    try {
      const res = await fetch(`/api/admin/pages/${slug}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionKey: lib.key,
          animationKey: lib.animation,
          sortOrder: sections.length,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setAddErr(data.error ?? 'Failed to add section.'); return }
      setSections((prev) => [...prev, data.section])
      setSectionToAdd('')
      setSectionSearch('')
    } catch { setAddErr('Network error — section not added.') }
    finally { setAddingSection(false) }
  }

  async function moveSection(sectionId, direction) {
    if (movingSection) return
    const currentIndex = sections.findIndex((section) => section.id === sectionId)
    const nextIndex = currentIndex + direction
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= sections.length) return
    const previous = sections
    const next = [...sections]
    ;[next[currentIndex], next[nextIndex]] = [next[nextIndex], next[currentIndex]]
    const ordered = next.map((section, index) => ({ ...section, sortOrder: index }))
    setSections(ordered)
    setMovingSection(sectionId)
    setAddErr('')
    try {
      const response = await fetch('/api/admin/sections', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: ordered.map(({ id, sortOrder }) => ({ id, sortOrder })) }),
      })
      if (!response.ok) throw new Error('Could not change section order.')
    } catch (error) {
      setSections(previous)
      setAddErr(error.message || 'Could not change section order.')
    } finally { setMovingSection('') }
  }

  async function deleteSection() {
    if (!sectionToDelete) return
    setDeletingSection(true)
    setAddErr('')
    try {
      const response = await fetch(`/api/admin/sections/${sectionToDelete.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Could not delete this section.')
      setSections((current) => current.filter((section) => section.id !== sectionToDelete.id).map((section, index) => ({ ...section, sortOrder: index })))
      setSectionToDelete(null)
    } catch (error) { setAddErr(error.message || 'Could not delete this section.') }
    finally { setDeletingSection(false) }
  }

  return (
    <div>
      {/* Publish bar */}
      <div className="admin-card admin-mb-16">
        <div className="admin-card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={`admin-badge ${published ? 'admin-badge-published' : 'admin-badge-draft'}`}>
              {published ? 'Published' : 'Draft'}
            </span>
            {pubMsg && <span className="admin-text-muted admin-text-sm">{pubMsg}</span>}
          </div>
          <button
            className={`admin-btn admin-btn-sm ${published ? 'admin-btn-secondary' : 'admin-btn-primary'}`}
            onClick={togglePublish}
            disabled={toggling}
          >
            {toggling ? '…' : published ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {['content', 'seo'].map((t) => (
          <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'content' ? 'Content' : 'SEO'}
          </button>
        ))}
      </div>

      {tab === 'content' && (
        <div>
          {/* Add section */}
          <div className="admin-card admin-mb-16">
            <div className="admin-card-body" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <input
                className="admin-input"
                list="cms-section-templates"
                value={sectionSearch}
                onChange={(event) => {
                  const value = event.target.value
                  const match = SECTION_LIBRARY.find((section) => section.label.toLowerCase() === value.toLowerCase() || section.key === value)
                  setSectionSearch(value)
                  setSectionToAdd(match?.key ?? '')
                }}
                placeholder="Search all section templates…"
                style={{ maxWidth: 360 }}
                aria-label="Search section templates"
              />
              <datalist id="cms-section-templates">
                {SECTION_LIBRARY.map((section) => <option key={section.key} value={section.label}>{section.key}</option>)}
              </datalist>
              <button
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={addSection}
                disabled={!sectionToAdd || addingSection}
              >
                {addingSection ? 'Adding…' : 'Add'}
              </button>
              {addErr && <span className="admin-field-error">{addErr}</span>}
            </div>
          </div>

          {sections.length === 0 ? (
            <div className="admin-card">
              <div className="admin-card-body">
                <div className="admin-empty">
                  <div className="admin-empty-icon">📝</div>
                  <p className="admin-empty-title">No sections yet. Use “+ Add Section” above to create the first one.</p>
                  <p className="admin-text-muted">Run <code>npm run db:seed</code> to populate sections from the current site content.</p>
                </div>
              </div>
            </div>
          ) : (
            sections.map((section, index) => (
              <SectionPanel key={section.id} section={section} slug={slug} index={index} total={sections.length} onMove={moveSection} onDelete={setSectionToDelete} />
            ))
          )}
        </div>
      )}

      {tab === 'seo' && (
        <SeoTab pageId={page.id} slug={slug} seo={page.seoMeta} />
      )}

      {sectionToDelete && (
        <Modal title="Delete section" onClose={() => setSectionToDelete(null)}>
          <p style={{ marginBottom: 16 }}>Delete “{sectionToDelete.sectionKey}” and all of its content? This cannot be undone.</p>
          <div className="admin-flex admin-gap-8" style={{ justifyContent: 'flex-end' }}>
            <button className="admin-btn admin-btn-secondary" onClick={() => setSectionToDelete(null)} disabled={deletingSection}>Cancel</button>
            <button className="admin-btn admin-btn-danger" onClick={deleteSection} disabled={deletingSection}>{deletingSection ? 'Deleting…' : 'Delete section'}</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Inline SEO tab ───────────────────────────────────────────────────────────

function SeoTab({ slug, seo }) {
  const [form, setForm] = useState({
    metaTitle:       seo?.metaTitle       ?? '',
    metaDescription: seo?.metaDescription ?? '',
    ogTitle:         seo?.ogTitle         ?? '',
    ogDescription:   seo?.ogDescription   ?? '',
    canonical:       seo?.canonical       ?? '',
    noIndex:         seo?.noIndex ? 'noindex' : 'index',
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState('')
  const [err, setErr]       = useState('')

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true)
    setMsg('')
    setErr('')
    try {
      const res = await fetch(`/api/admin/seo/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setErr((data.errors ?? [data.error]).join(', ')); return }
      setMsg('SEO saved.')
      setTimeout(() => setMsg(''), 3000)
    } catch { setErr('Network error') }
    finally { setSaving(false) }
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <span className="admin-card-title">SEO meta</span>
      </div>
      <div className="admin-card-body">
        {[
          { key: 'metaTitle',       label: 'Meta title',       max: 70,  hint: 'Recommended 50–60 chars' },
          { key: 'metaDescription', label: 'Meta description', max: 170, hint: 'Recommended 140–160 chars' },
          { key: 'ogTitle',         label: 'OG title',         max: 95,  hint: 'Falls back to meta title if empty' },
          { key: 'ogDescription',   label: 'OG description',   max: 200, hint: 'Falls back to meta description if empty' },
          { key: 'canonical',       label: 'Canonical URL',    max: 300, hint: 'Leave blank to use default' },
        ].map(({ key, label, max, hint }) => (
          <div className="admin-form-group" key={key}>
            <label className="admin-label">{label}</label>
            {max > 100
              ? <textarea className="admin-textarea" rows={3} value={form[key]} maxLength={max} onChange={(e) => set(key, e.target.value)} />
              : <input className="admin-input" value={form[key]} maxLength={max} onChange={(e) => set(key, e.target.value)} />
            }
            <CharCount value={form[key]} max={max} />
            <p className="admin-field-hint">{hint}</p>
          </div>
        ))}

        <div className="admin-form-group">
          <label className="admin-label">Search indexing</label>
          <select className="admin-select" value={form.noIndex} onChange={(e) => set('noIndex', e.target.value)}>
            <option value="index">Index (default)</option>
            <option value="noindex">No index</option>
          </select>
        </div>

        {err && <div className="admin-alert admin-alert-error admin-mb-16">{err}</div>}
        {msg && <div className="admin-alert admin-alert-success admin-mb-16">{msg}</div>}

        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save SEO'}
        </button>
      </div>
    </div>
  )
}
