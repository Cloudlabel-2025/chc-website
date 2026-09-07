'use client'

import { useState } from 'react'
import Modal from '@/app/(admin)/components/Modal'
import { Edit, Delete } from '@/app/(admin)/components/AdminIcons'

export default function PagesManager({ initialPages, templates }) {
  const [pages, setPages] = useState(initialPages)
  const [form, setForm] = useState({ title: '', slug: '', templateId: '' })
  const [templateSearch, setTemplateSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function createPage(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Could not create page.')
        return
      }
      setPages((current) => [...current, data.page].sort((a, b) => a.slug.localeCompare(b.slug)))
      setForm({ title: '', slug: '', templateId: '' })
      setTemplateSearch('')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function togglePublish(page) {
    if (!page.id) return
    try {
      const res = await fetch(`/api/admin/pages/${page.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !page.isPublished }),
      })
      const data = await res.json()
      if (res.ok) {
        setPages((prev) => prev.map((p) => (p.slug === page.slug ? { ...p, isPublished: data.page.isPublished } : p)))
      }
    } catch (err) {
      console.error('Failed to toggle publish:', err)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/pages/${deleteTarget.slug}`, { method: 'DELETE' })
      if (res.ok) {
        setPages((prev) => prev.filter((p) => p.slug !== deleteTarget.slug))
        setDeleteTarget(null)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Could not delete page.')
      }
    } catch {
      setError('Network error. Failed to delete page.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="admin-card admin-mb-16">
        <div className="admin-card-header">
          <span className="admin-card-title">Create a new page</span>
        </div>
        <form className="admin-card-body" onSubmit={createPage}>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-label admin-label-required">Page Title</label>
              <input
                className="admin-input"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Case Studies"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label admin-label-required">URL Slug</label>
              <input
                className="admin-input"
                required
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                value={form.slug}
                onChange={(e) => setForm({
                  ...form,
                  // Let editors paste either `/case-studies` or `case-studies`.
                  // The database stores the canonical slug without the slash.
                  slug: e.target.value.toLowerCase().trim().replace(/^\/+/, ''),
                })}
                placeholder="e.g. /case-studies"
              />
              <p className="admin-field-hint">The leading slash is optional.</p>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Page Snapshot Template (Optional)</label>
              <input
                className="admin-input"
                list="cms-page-templates"
                value={templateSearch}
                onChange={(event) => {
                  const value = event.target.value
                  const match = templates.find((template) => template.name.toLowerCase() === value.toLowerCase())
                  setTemplateSearch(value)
                  setForm({ ...form, templateId: match?.id ?? '' })
                }}
                placeholder="Blank page — search a template"
                aria-label="Search page snapshot templates"
              />
              <datalist id="cms-page-templates">
                {templates.map((template) => <option key={template.id} value={template.name} />)}
              </datalist>
              <p className="admin-field-hint">Leave blank for a blank page, or search and select a template.</p>
            </div>
          </div>
          {error && <p className="admin-field-error">{error}</p>}
          <button className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? 'Creating…' : '+ Create Page'}
          </button>
        </form>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table admin-table-stack">
            <thead>
              <tr>
                <th>Page Title</th>
                <th>URL Slug</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((row) => (
                <tr key={row.slug}>
                  <td data-label="Page title" style={{ fontWeight: 600 }}>{row.title}</td>
                  <td data-label="URL slug">
                    <code style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
                      /{row.slug === 'home' ? '' : row.slug}
                    </code>
                  </td>
                  <td data-label="Status">
                    {row.id ? (
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        onClick={() => togglePublish(row)}
                        title="Click to toggle publish state"
                      >
                        <span
                          className={`admin-badge ${
                            row.isPublished ? 'admin-badge-published' : 'admin-badge-draft'
                          }`}
                        >
                          {row.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </button>
                    ) : (
                      <span className="admin-badge admin-badge-locked">Not seeded</span>
                    )}
                  </td>
                  <td data-label="Last updated" className="admin-text-muted admin-text-sm" suppressHydrationWarning>
                    {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString('en-AU') : '—'}
                  </td>
                  <td data-label="Actions" style={{ textAlign: 'right' }}>
                    <div className="admin-flex admin-gap-8" style={{ justifyContent: 'flex-end' }}>
                      <a href={`/admin/pages/${row.slug}`} className="admin-btn admin-btn-secondary admin-btn-sm" aria-label={`Edit sections for ${row.title}`}>
                        <span className="admin-btn-icon-wrap" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Edit size={14} /><span className="admin-btn-label">Edit Sections</span></span>
                      </a>
                      {row.id && row.slug !== 'home' && (
                        <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteTarget(row)} aria-label={`Delete ${row.title}`}>
                          <span className="admin-btn-icon-wrap" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Delete size={14} /><span className="admin-btn-label">Delete</span></span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteTarget && (
        <Modal title="Delete Page" onClose={() => setDeleteTarget(null)}>
          <p style={{ marginBottom: 16 }}>
            Are you sure you want to delete the page <strong>"{deleteTarget.title}"</strong> (<code>/{deleteTarget.slug}</code>)?
            This will remove all sections, content blocks, and SEO metadata associated with this page.
          </p>
          <div className="admin-flex admin-gap-8" style={{ justifyContent: 'flex-end' }}>
            <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </button>
            <button className="admin-btn admin-btn-danger" disabled={deleting} onClick={handleDelete}>
              {deleting ? 'Deleting…' : 'Delete Page'}
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
