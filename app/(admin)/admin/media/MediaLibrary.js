'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp,image/svg+xml,image/gif,image/avif,image/heic,image/heif,image/bmp,image/tiff,image/x-icon,image/vnd.microsoft.icon'

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

export default function MediaLibrary({ onSelect, selectionMode = false }) {
  const [assets, setAssets]         = useState([])
  const [total, setTotal]           = useState(0)
  const [pages, setPages]           = useState(1)
  const [page, setPage]             = useState(1)
  const [search, setSearch]         = useState('')
  const [loading, setLoading]       = useState(true)
  const [uploading, setUploading]   = useState(false)
  const [uploadErrors, setUploadErrors] = useState([])
  const [selected, setSelected]     = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [altEditing, setAltEditing] = useState(null)
  const [altValue, setAltValue]     = useState('')
  const [error, setError]           = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const fileInputRef = useRef(null)
  const searchTimer  = useRef(null)

  const fetchAssets = useCallback(async (p = 1, q = search) => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ page: p, search: q })
      const res = await fetch(`/api/admin/media?${params}`)
      if (!res.ok) throw new Error('Failed to load media')
      const data = await res.json()
      setAssets(data.assets)
      setTotal(data.total)
      setPages(data.pages)
      setPage(p)
    } catch (err) {
      setError('Failed to load media library.')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { fetchAssets(1, '') }, [])

  // Debounced search
  function handleSearch(e) {
    const q = e.target.value
    setSearch(q)
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => fetchAssets(1, q), 400)
  }

  // Upload
  async function handleUpload(e) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    setUploading(true)
    setUploadErrors([])
    const errs = []

    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('altText', '')

      const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
      const data = await res.json()

      if (!res.ok) {
        errs.push(`${file.name}: ${(data.errors ?? [data.error]).join(', ')}`)
      }
    }

    setUploadErrors(errs)
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
    const hadSuccess = errs.length < files.length
    if (hadSuccess) {
      const okCount = files.length - errs.length
      setSuccessMsg(`Uploaded ${okCount} image${okCount > 1 ? 's' : ''} successfully.`)
      setTimeout(() => setSuccessMsg(''), 4000)
    }
    fetchAssets(hadSuccess ? 1 : page, search)
  }

  // Delete
  async function confirmDelete(asset) {
    // First fetch reference count
    const res  = await fetch(`/api/admin/media/${asset.id}`)
    const data = await res.json()
    setDeleteConfirm({ asset, references: data.asset?.referenceCount ?? 0 })
  }

  async function executeDelete(force = false) {
    if (!deleteConfirm) return
    const url = `/api/admin/media/${deleteConfirm.asset.id}${force ? '?force=true' : ''}`
    const res  = await fetch(url, { method: 'DELETE' })
    if (res.ok) {
      setDeleteConfirm(null)
      setSelected(null)
      fetchAssets(page, search)
    } else {
      const data = await res.json()
      setError(data.error ?? 'Delete failed.')
      setDeleteConfirm(null)
    }
  }

  // Alt text save
  async function saveAlt() {
    if (!altEditing) return
    const res = await fetch(`/api/admin/media/${altEditing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ altText: altValue }),
    })
    if (res.ok) {
      const data = await res.json()
      setAssets((prev) => prev.map((a) => a.id === data.asset.id ? data.asset : a))
      if (selected?.id === data.asset.id) setSelected(data.asset)
    }
    setAltEditing(null)
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="admin-flex admin-items-center admin-justify-between admin-mb-16" style={{ gap: 12, flexWrap: 'wrap' }}>
        <input
          type="search"
          placeholder="Search by filename…"
          value={search}
          onChange={handleSearch}
          className="admin-input"
          style={{ maxWidth: 280 }}
        />
        <div className="admin-flex admin-gap-8">
          <span className="admin-text-muted admin-text-sm" style={{ alignSelf: 'center' }}>
            {total} asset{total !== 1 ? 's' : ''}
          </span>
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading…' : '+ Upload'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            multiple
            style={{ display: 'none' }}
            onChange={handleUpload}
          />
        </div>
      </div>

      {/* Upload errors */}
      {uploadErrors.length > 0 && (
        <div className="admin-alert admin-alert-error admin-mb-16">
          <div>
            <strong>Upload failed:</strong>
            <ul style={{ marginTop: 4, paddingLeft: 16 }}>
              {uploadErrors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        </div>
      )}

      {error && (
        <div className="admin-alert admin-alert-error admin-mb-16">{error}</div>
      )}

      {successMsg && (
        <div className="admin-alert admin-mb-16" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: 'var(--admin-text)' }}>{successMsg}</div>
      )}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ aspectRatio: '1', background: 'var(--admin-border)', borderRadius: 'var(--admin-radius-sm)', animation: 'pulse 1.5s infinite' }} />
            ))
          : assets.map((asset) => (
              <AssetTile
                key={asset.id}
                asset={asset}
                isSelected={selected?.id === asset.id}
                selectionMode={selectionMode}
                onSelect={() => {
                  if (selectionMode && onSelect) { onSelect(asset); return }
                  setSelected(asset)
                }}
                onDelete={() => confirmDelete(asset)}
                onEditAlt={() => { setAltEditing(asset); setAltValue(asset.altText) }}
              />
            ))
        }
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="admin-flex admin-items-center admin-gap-8" style={{ marginTop: 20, justifyContent: 'center' }}>
          <button className="admin-btn admin-btn-secondary admin-btn-sm" disabled={page <= 1} onClick={() => fetchAssets(page - 1, search)}>← Prev</button>
          <span className="admin-text-muted admin-text-sm">Page {page} of {pages}</span>
          <button className="admin-btn admin-btn-secondary admin-btn-sm" disabled={page >= pages} onClick={() => fetchAssets(page + 1, search)}>Next →</button>
        </div>
      )}

      {/* Asset detail panel */}
      {selected && !selectionMode && (
        <AssetPanel
          asset={selected}
          onClose={() => setSelected(null)}
          onDelete={() => confirmDelete(selected)}
          onEditAlt={() => { setAltEditing(selected); setAltValue(selected.altText) }}
        />
      )}

      {/* Alt text modal */}
      {altEditing && (
        <Modal title="Edit alt text" onClose={() => setAltEditing(null)}>
          <div className="admin-form-group">
            <label className="admin-label">Alt text</label>
            <input
              className="admin-input"
              value={altValue}
              maxLength={200}
              onChange={(e) => setAltValue(e.target.value)}
              placeholder="Describe the image for screen readers…"
            />
            <p className="admin-char-count">{altValue.length}/200</p>
          </div>
          <div className="admin-flex admin-gap-8" style={{ justifyContent: 'flex-end' }}>
            <button className="admin-btn admin-btn-secondary" onClick={() => setAltEditing(null)}>Cancel</button>
            <button className="admin-btn admin-btn-primary" onClick={saveAlt}>Save</button>
          </div>
        </Modal>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <Modal title="Delete image" onClose={() => setDeleteConfirm(null)}>
          {deleteConfirm.references > 0 ? (
            <div className="admin-alert admin-alert-warning" style={{ marginBottom: 16 }}>
              This image is used in <strong>{deleteConfirm.references} content block{deleteConfirm.references !== 1 ? 's' : ''}</strong>.
              Deleting it will remove those references. This cannot be undone.
            </div>
          ) : (
            <p style={{ marginBottom: 16 }}>
              Delete <strong>{deleteConfirm.asset.filename}</strong>? This cannot be undone.
            </p>
          )}
          <div className="admin-flex admin-gap-8" style={{ justifyContent: 'flex-end' }}>
            <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
            <button
              className="admin-btn admin-btn-danger"
              onClick={() => executeDelete(deleteConfirm.references > 0)}
            >
              {deleteConfirm.references > 0 ? 'Delete anyway' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function AssetTile({ asset, isSelected, selectionMode, onSelect, onDelete, onEditAlt }) {
  const isImage = asset.mimeType !== 'image/svg+xml'
  return (
    <div
      onClick={onSelect}
      style={{
        border: `2px solid ${isSelected ? 'var(--admin-primary)' : 'var(--admin-border)'}`,
        borderRadius: 'var(--admin-radius-sm)',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'var(--admin-surface)',
        position: 'relative',
      }}
    >
      <div style={{ aspectRatio: '1', background: 'var(--admin-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img
          src={asset.publicUrl}
          alt={asset.altText || asset.filename}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
      </div>
      <div style={{ padding: '6px 8px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--admin-text)' }}>
          {asset.filename}
        </p>
        <p style={{ fontSize: 10, color: 'var(--admin-text-muted)' }}>
          {formatBytes(asset.sizeBytes)}
          {asset.width ? ` · ${asset.width}×${asset.height}` : ''}
        </p>
      </div>
      {!selectionMode && (
        <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: 4 }}>
          <button
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ padding: '2px 6px', fontSize: 10 }}
            onClick={(e) => { e.stopPropagation(); onEditAlt() }}
            title="Edit alt text"
          >alt</button>
          <button
            className="admin-btn admin-btn-danger admin-btn-sm"
            style={{ padding: '2px 6px', fontSize: 10 }}
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            title="Delete"
          >✕</button>
        </div>
      )}
    </div>
  )
}

function AssetPanel({ asset, onClose, onDelete, onEditAlt }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, padding: 24,
    }}>
      <div className="admin-card" style={{ maxWidth: 560, width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
        <div className="admin-card-header">
          <span className="admin-card-title" style={{ wordBreak: 'break-all' }}>{asset.filename}</span>
          <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="admin-card-body">
          <img src={asset.publicUrl} alt={asset.altText || asset.filename} style={{ width: '100%', borderRadius: 4, marginBottom: 16 }} />
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['Type', asset.mimeType],
                ['Size', formatBytes(asset.sizeBytes)],
                ['Dimensions', asset.width ? `${asset.width}×${asset.height}px` : '—'],
                ['Alt text', asset.altText || <em style={{ color: 'var(--admin-text-muted)' }}>None</em>],
                ['Uploaded', new Date(asset.createdAt).toLocaleDateString()],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td style={{ padding: '4px 0', color: 'var(--admin-text-muted)', width: 100 }}>{k}</td>
                  <td style={{ padding: '4px 0' }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="admin-flex admin-gap-8" style={{ marginTop: 16, justifyContent: 'flex-end' }}>
            <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={onEditAlt}>Edit alt text</button>
            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={onDelete}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 300, padding: 24,
    }}>
      <div className="admin-card" style={{ maxWidth: 440, width: '100%' }}>
        <div className="admin-card-header">
          <span className="admin-card-title">{title}</span>
          <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="admin-card-body">{children}</div>
      </div>
    </div>
  )
}
