'use client'

import { useState } from 'react'

function CharCount({ value = '', max }) {
  const len = value.length
  const cls = len > max ? 'over' : len > max * 0.85 ? 'warn' : ''
  return <p className={`admin-char-count ${cls}`}>{len}/{max}</p>
}

function SeoModal({ row, onClose, onSaved }) {
  const [form, setForm] = useState({
    metaTitle:       row.seo?.metaTitle       ?? '',
    metaDescription: row.seo?.metaDescription ?? '',
    ogTitle:         row.seo?.ogTitle         ?? '',
    ogDescription:   row.seo?.ogDescription   ?? '',
    canonical:       row.seo?.canonical       ?? '',
    noIndex:         row.seo?.noIndex ? 'noindex' : 'index',
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr]       = useState('')

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true)
    setErr('')
    try {
      const res = await fetch(`/api/admin/seo/${row.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setErr((data.errors ?? [data.error]).join(', ')); return }
      onSaved(row.slug, data.seo)
      onClose()
    } catch { setErr('Network error') }
    finally { setSaving(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 24 }}>
      <div className="admin-card" style={{ maxWidth: 560, width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
        <div className="admin-card-header">
          <span className="admin-card-title">SEO — {row.title}</span>
          <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="admin-card-body">
          {[
            { key: 'metaTitle',       label: 'Meta title',       max: 70,  rows: 1,  hint: 'Recommended 50–60 chars' },
            { key: 'metaDescription', label: 'Meta description', max: 170, rows: 3,  hint: 'Recommended 140–160 chars' },
            { key: 'ogTitle',         label: 'OG title',         max: 95,  rows: 1,  hint: 'Falls back to meta title' },
            { key: 'ogDescription',   label: 'OG description',   max: 200, rows: 2,  hint: 'Falls back to meta description' },
            { key: 'canonical',       label: 'Canonical URL',    max: 300, rows: 1,  hint: 'Leave blank for default' },
          ].map(({ key, label, max, rows, hint }) => (
            <div className="admin-form-group" key={key}>
              <label className="admin-label">{label}</label>
              {rows > 1
                ? <textarea className="admin-textarea" rows={rows} value={form[key]} maxLength={max} onChange={(e) => set(key, e.target.value)} />
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

          <div className="admin-flex admin-gap-8" style={{ justifyContent: 'flex-end' }}>
            <button className="admin-btn admin-btn-secondary" onClick={onClose}>Cancel</button>
            <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SeoManager({ rows: initialRows }) {
  const [rows, setRows]     = useState(initialRows)
  const [editing, setEditing] = useState(null)

  function handleSaved(slug, seo) {
    setRows((prev) => prev.map((r) => r.slug === slug ? { ...r, seo } : r))
  }

  function statusBadge(seo) {
    if (!seo) return <span className="admin-badge admin-badge-locked">Not set</span>
    if (!seo.metaTitle || !seo.metaDescription) return <span className="admin-badge admin-badge-draft">Incomplete</span>
    return <span className="admin-badge admin-badge-published">Complete</span>
  }

  return (
    <div className="admin-card">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Page</th>
              <th>Meta title</th>
              <th>Meta description</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.slug}>
                <td style={{ fontWeight: 600 }}>{row.title}</td>
                <td className="admin-text-muted admin-text-sm" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {row.seo?.metaTitle || <em>—</em>}
                </td>
                <td className="admin-text-muted admin-text-sm" style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {row.seo?.metaDescription || <em>—</em>}
                </td>
                <td>{statusBadge(row.seo)}</td>
                <td>
                  <button
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => setEditing(row)}
                    disabled={!row.pageId}
                    title={!row.pageId ? 'Page not seeded yet' : undefined}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <SeoModal
          row={editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
