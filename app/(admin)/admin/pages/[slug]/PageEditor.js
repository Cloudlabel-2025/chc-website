'use client'

import { useState, useCallback } from 'react'
import MediaLibrary from '@/app/(admin)/admin/media/MediaLibrary'

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

function BlockField({ sectionId, block, fieldKey, blockType, label, maxLength, required, onSaved }) {
  const [value, setValue]   = useState(block?.textValue ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [err, setErr]       = useState('')
  const [showPicker, setShowPicker] = useState(false)

  const isImage = blockType === 'IMAGE'
  const asset   = block?.mediaAsset ?? null

  async function save() {
    setSaving(true)
    setErr('')
    try {
      const res = await fetch(
        `/api/admin/pages/${window.__pageSlug}/sections/${sectionId}/blocks`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fieldKey, blockType, textValue: isImage ? null : value }),
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
          body: JSON.stringify({ fieldKey, blockType: 'IMAGE', mediaAssetId: asset.id }),
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
    { fieldKey: 'officeAddress', blockType: 'TEXT', label: 'Office address',  maxLength: 200 },
    { fieldKey: 'phone',         blockType: 'TEXT', label: 'Phone',           maxLength: 30 },
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
}

function SectionPanel({ section, slug }) {
  const [open, setOpen]     = useState(true)
  const [blocks, setBlocks] = useState(section.blocks ?? [])
  const [visible, setVisible] = useState(section.isVisible)
  const [toggling, setToggling] = useState(false)

  const fields = SECTION_FIELDS[section.sectionKey] ?? []

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
          <span className={`admin-section-chevron ${open ? 'open' : ''}`}>▾</span>
        </div>
      </div>

      {open && (
        <div className="admin-card-body">
          {fields.length === 0 ? (
            <p className="admin-text-muted admin-text-sm">
              This section has repeatable items — use the seed script to populate initial data,
              then edit individual items here.
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
          {page.sections.length === 0 ? (
            <div className="admin-card">
              <div className="admin-card-body">
                <div className="admin-empty">
                  <div className="admin-empty-icon">📝</div>
                  <p className="admin-empty-title">No sections yet</p>
                  <p className="admin-text-muted">Run <code>npm run db:seed</code> to populate sections from the current site content.</p>
                </div>
              </div>
            </div>
          ) : (
            page.sections.map((section) => (
              <SectionPanel key={section.id} section={section} slug={slug} />
            ))
          )}
        </div>
      )}

      {tab === 'seo' && (
        <SeoTab pageId={page.id} slug={slug} seo={page.seoMeta} />
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
