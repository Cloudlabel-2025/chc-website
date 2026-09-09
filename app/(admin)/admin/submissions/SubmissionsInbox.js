'use client'

import { useState } from 'react'

const FORM_LABELS = {
  CONTACT:      'Contact',
  GIVE_ONE_HOUR:'Give One Hour',
  NEWSLETTER:   'Newsletter',
  CUSTOM:       'Custom form',
}

function typeLabel(sub) {
  if (sub.formType === 'CUSTOM') return sub.formDefinition?.title ?? 'Custom form'
  return FORM_LABELS[sub.formType] ?? sub.formType
}

function isGiveOneHour(sub) {
  return sub.formType === 'GIVE_ONE_HOUR' || sub.formType === 'CUSTOM' && sub.formDefinition?.slug === 'give-one-hour'
}

function formatDate(d) {
  return new Date(d).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })
}

function DetailPanel({ submission, onClose, onDelete, onMarkRead }) {
  const data = submission.data ?? {}
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 24 }}>
      <div className="admin-card" style={{ maxWidth: 560, width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
        <div className="admin-card-header">
          <div>
            <span className="admin-card-title">{typeLabel(submission)}</span>
            <span className="admin-text-muted admin-text-sm" style={{ marginLeft: 8 }}>{formatDate(submission.submittedAt)}</span>
          </div>
          <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="admin-card-body">
          {Object.entries(data).map(([k, v]) => (
            <div className="admin-submission-field" key={k}>
              <span className="admin-submission-label">{k.replace(/_/g, ' ')}</span>
              <span style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{String(v)}</span>
            </div>
          ))}
          {submission.ipAddress && (
            <p className="admin-text-muted admin-text-sm" style={{ marginTop: 12 }}>IP: {submission.ipAddress}</p>
          )}
          <div className="admin-flex admin-gap-8" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
            {submission.isRead
              ? <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => onMarkRead(submission.id, false)}>Mark unread</button>
              : <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => onMarkRead(submission.id, true)}>Mark read</button>
            }
            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => onDelete(submission.id)}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SubmissionsInbox({ initialSubmissions, initialTotal }) {
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [total, setTotal]             = useState(initialTotal)
  const [filter, setFilter]           = useState('')
  const [page, setPage]               = useState(1)
  const [pages, setPages]             = useState(Math.ceil(initialTotal / 20))
  const [loading, setLoading]         = useState(false)
  const [selected, setSelected]       = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  async function load(p = 1, formType = filter) {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: p, ...(formType ? { formType } : {}) })
      const res  = await fetch(`/api/admin/submissions?${params}`)
      const data = await res.json()
      setSubmissions(data.submissions)
      setTotal(data.total)
      setPages(data.pages)
      setPage(p)
    } finally { setLoading(false) }
  }

  async function openDetail(sub) {
    // Auto-mark read via GET
    const res  = await fetch(`/api/admin/submissions/${sub.id}`)
    const data = await res.json()
    if (res.ok) {
      setSubmissions((prev) => prev.map((s) => s.id === sub.id ? { ...s, isRead: true } : s))
      setSelected(data.submission)
    }
  }

  async function markRead(id, isRead) {
    await fetch('/api/admin/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [id], isRead }),
    })
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, isRead } : s))
    if (selected?.id === id) setSelected((s) => ({ ...s, isRead }))
  }

  async function doDelete(id) {
    await fetch(`/api/admin/submissions/${id}`, { method: 'DELETE' })
    setSubmissions((prev) => prev.filter((s) => s.id !== id))
    setTotal((t) => t - 1)
    setDeleteConfirm(null)
    if (selected?.id === id) setSelected(null)
  }

  function handleFilter(type) {
    setFilter(type)
    load(1, type)
  }

  const TYPES = ['', 'CONTACT', 'GIVE_ONE_HOUR', 'NEWSLETTER']

  return (
    <div>
      {/* Filter tabs */}
      <div className="admin-tabs">
        {TYPES.map((t) => (
          <button key={t} className={`admin-tab ${filter === t ? 'active' : ''}`} onClick={() => handleFilter(t)}>
            {t ? FORM_LABELS[t] : 'All'}
          </button>
        ))}
      </div>

      <div className="admin-card">
        {submissions.length === 0 ? (
          <div className="admin-card-body">
            <div className="admin-empty">
              <div className="admin-empty-icon">📬</div>
              <p className="admin-empty-title">No submissions yet</p>
              <p className="admin-text-muted">Form submissions will appear here once the public forms are live.</p>
            </div>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 12 }}></th>
                  <th>Type</th>
                  <th>From</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => {
                  const data = sub.data ?? {}
                  const from = data.name ?? data.full_name ?? data.email ?? '—'
                  return (
                    <tr key={sub.id} style={{ opacity: loading ? 0.5 : 1 }}>
                      <td>
                        {!sub.isRead && <span className="admin-unread-dot" />}
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-draft">
                          {isGiveOneHour(sub) && <span className="admin-form-dot admin-form-dot--red" />}
                          {typeLabel(sub)}
                        </span>
                      </td>
                      <td style={{ fontWeight: sub.isRead ? 400 : 600 }}>{from}</td>
                      <td className="admin-text-muted admin-text-sm">{formatDate(sub.submittedAt)}</td>
                      <td>
                        <div className="admin-flex admin-gap-8">
                          <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => openDetail(sub)}>View</button>
                          <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteConfirm(sub.id)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div className="admin-flex admin-items-center admin-gap-8" style={{ padding: 16, justifyContent: 'center' }}>
            <button className="admin-btn admin-btn-secondary admin-btn-sm" disabled={page <= 1} onClick={() => load(page - 1)}>← Prev</button>
            <span className="admin-text-muted admin-text-sm">Page {page} of {pages}</span>
            <button className="admin-btn admin-btn-secondary admin-btn-sm" disabled={page >= pages} onClick={() => load(page + 1)}>Next →</button>
          </div>
        )}
      </div>

      {selected && (
        <DetailPanel
          submission={selected}
          onClose={() => setSelected(null)}
          onDelete={(id) => { setDeleteConfirm(id); setSelected(null) }}
          onMarkRead={markRead}
        />
      )}

      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 24 }}>
          <div className="admin-card" style={{ maxWidth: 400, width: '100%' }}>
            <div className="admin-card-header"><span className="admin-card-title">Delete submission</span></div>
            <div className="admin-card-body">
              <p style={{ marginBottom: 16 }}>Delete this submission permanently? This cannot be undone.</p>
              <div className="admin-flex admin-gap-8" style={{ justifyContent: 'flex-end' }}>
                <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="admin-btn admin-btn-danger" onClick={() => doDelete(deleteConfirm)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
