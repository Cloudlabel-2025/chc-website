'use client'

import { useState } from 'react'

const FIELD_TYPES = ['text', 'textarea', 'email', 'url', 'tel', 'number', 'select', 'radio', 'checkbox', 'date']

function emptyField() {
  return { key: '', type: 'text', label: '', placeholder: '', required: false, minLength: '', maxLength: '', options: [], helpText: '' }
}

function FieldEditor({ field, onChange, onRemove }) {
  function set(k, v) { onChange({ ...field, [k]: v }) }
  return (
    <div className="admin-card" style={{ padding: 16, marginBottom: 12, border: '1px solid var(--admin-border)' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <div style={{ flex: '1 1 140px' }}>
          <label className="admin-label">Key (slug)</label>
          <input className="admin-input" value={field.key} onChange={(e) => set('key', e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} placeholder="e.g. full_name" />
        </div>
        <div style={{ flex: '0 0 140px' }}>
          <label className="admin-label">Type</label>
          <select className="admin-select" value={field.type} onChange={(e) => set('type', e.target.value)}>
            {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-end' }}>
          <label className="admin-label" style={{ gap: 6 }}><input type="checkbox" checked={field.required} onChange={(e) => set('required', e.target.checked)} /> Required</label>
        </div>
        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-end' }}>
          <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={onRemove}>Remove</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div><label className="admin-label">Label</label><input className="admin-input" value={field.label} onChange={(e) => set('label', e.target.value)} placeholder="Field label" /></div>
        <div><label className="admin-label">Placeholder</label><input className="admin-input" value={field.placeholder} onChange={(e) => set('placeholder', e.target.value)} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div><label className="admin-label">Min length</label><input className="admin-input" type="number" value={field.minLength} onChange={(e) => set('minLength', e.target.value)} placeholder="e.g. 2" /></div>
        <div><label className="admin-label">Max length</label><input className="admin-input" type="number" value={field.maxLength} onChange={(e) => set('maxLength', e.target.value)} placeholder="e.g. 100" /></div>
      </div>
      {(field.type === 'select' || field.type === 'radio') && (
        <div style={{ marginBottom: 12 }}>
          <label className="admin-label">Options (comma-separated)</label>
          <input className="admin-input" value={(field.options ?? []).join(', ')} onChange={(e) => set('options', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} placeholder="e.g. online, in_person, both" />
        </div>
      )}
      <div><label className="admin-label">Help text</label><input className="admin-input" value={field.helpText} onChange={(e) => set('helpText', e.target.value)} placeholder="Optional help text" /></div>
    </div>
  )
}

function FormEditor({ form, onSaved, onCancel }) {
  const [slug, setSlug] = useState(form.slug ?? '')
  const [title, setTitle] = useState(form.title ?? '')
  const [buttonText, setButtonText] = useState(form.buttonText ?? 'Submit')
  const [successMessage, setSuccessMessage] = useState(form.successMessage ?? '')
  const [isActive, setIsActive] = useState(form.isActive ?? true)
  const [fields, setFields] = useState(form.fields ?? [])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isNew = !form.id

  async function handleSave() {
    if (!slug.trim() || !title.trim()) { setError('Slug and title are required.'); return }
    setSaving(true); setError('')
    const payload = {
      slug: slug.trim().toLowerCase(),
      title: title.trim(),
      buttonText: buttonText.trim(),
      successMessage: successMessage.trim(),
      isActive,
      fields: fields.map((f) => ({
        key: f.key.trim(),
        type: f.type,
        label: f.label.trim() || f.key,
        placeholder: f.placeholder ?? '',
        required: !!f.required,
        minLength: f.minLength ? parseInt(f.minLength, 10) : undefined,
        maxLength: f.maxLength ? parseInt(f.maxLength, 10) : undefined,
        options: f.options ?? [],
        helpText: f.helpText ?? '',
      })).filter((f) => f.key),
    }
    try {
      const url = isNew ? '/api/admin/forms' : `/api/admin/forms/${form.slug}`
      const method = isNew ? 'POST' : 'PATCH'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Save failed.'); return }
      onSaved(data.form)
    } catch { setError('Network error.') }
    finally { setSaving(false) }
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header"><span className="admin-card-title">{isNew ? 'Create form' : `Edit: ${form.slug}`}</span></div>
      <div className="admin-card-body">
        {error && <div className="admin-alert admin-alert-error" style={{ marginBottom: 16 }}>{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div><label className="admin-label">Slug *</label><input className="admin-input" value={slug} onChange={(e) => setSlug(e.target.value)} disabled={!isNew} placeholder="e.g. contact" /></div>
          <div><label className="admin-label">Title *</label><input className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Form title" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div><label className="admin-label">Button text</label><input className="admin-input" value={buttonText} onChange={(e) => setButtonText(e.target.value)} /></div>
          <div><label className="admin-label">Success message</label><input className="admin-input" value={successMessage} onChange={(e) => setSuccessMessage(e.target.value)} /></div>
        </div>
        <div style={{ marginBottom: 16 }}><label className="admin-label" style={{ gap: 8 }}><input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Active (visible on site)</label></div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700 }}>Fields ({fields.length})</h4>
          <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setFields((f) => [...f, emptyField()])}>+ Add field</button>
        </div>
        {fields.length === 0 && <p className="admin-text-muted admin-text-sm" style={{ marginBottom: 12 }}>No fields yet. Add one to define this form.</p>}
        {fields.map((field, i) => (
          <FieldEditor key={i} field={field} onChange={(updated) => setFields((prev) => prev.map((f, idx) => idx === i ? updated : f))} onRemove={() => setFields((prev) => prev.filter((_, idx) => idx !== i))} />
        ))}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
          <button className="admin-btn admin-btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : isNew ? 'Create' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}

export default function FormBuilder({ initialForms }) {
  const [forms, setForms] = useState(initialForms)
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  // Keep initialForms in sync if parent re-renders with new data (not strictly needed for this page)
  // but forms state is source of truth after first load.

  async function handleDelete(slug) {
    if (!confirm(`Delete form "${slug}"? Submissions linked to it will remain but form will be gone.`)) return
    const res = await fetch(`/api/admin/forms/${slug}`, { method: 'DELETE' })
    if (res.ok) setForms((prev) => prev.filter((f) => f.slug !== slug))
    else {
      const data = await res.json()
      alert(data.error || 'Delete failed.')
    }
  }

  if (editing || creating) {
    const formData = editing ?? { slug: '', title: '', fields: [], buttonText: 'Submit', successMessage: '', isActive: true }
    return <FormEditor form={formData} onSaved={(saved) => {
      if (creating) setForms((prev) => [...prev, saved])
      else setForms((prev) => prev.map((f) => f.slug === saved.slug ? saved : f))
      setEditing(null); setCreating(false)
    }} onCancel={() => { setEditing(null); setCreating(false) }} />
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="admin-btn admin-btn-primary" onClick={() => setCreating(true)}>+ Create form</button>
      </div>
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table admin-table-stack">
            <thead><tr><th>Slug</th><th>Title</th><th>Fields</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {forms.length === 0 ? (
                <tr><td colSpan={5} className="admin-text-muted" style={{ textAlign: 'center', padding: 24 }}>No forms yet. Create one to get started.</td></tr>
              ) : forms.map((form) => (
                <tr key={form.slug}>
                  <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{form.slug}</td>
                  <td style={{ fontWeight: 600 }}>{form.title}</td>
                  <td className="admin-text-muted">{(form.fields ?? []).length}</td>
                  <td>{form.isActive ? <span className="admin-badge admin-badge-published">Active</span> : <span className="admin-badge admin-badge-locked">Inactive</span>}</td>
                  <td>
                    <div className="admin-flex admin-gap-8" style={{ justifyContent: 'flex-end' }}>
                      <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setEditing(form)}>Edit</button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(form.slug)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
