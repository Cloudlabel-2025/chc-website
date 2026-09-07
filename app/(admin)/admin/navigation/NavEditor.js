'use client'

import { useState } from 'react'
import { Add, Delete, Edit, MoveDown, MoveUp } from '@/app/(admin)/components/AdminIcons'

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 24 }}>
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

function ItemForm({ initial = {}, onSave, onCancel, saving }) {
  const [label, setLabel] = useState(initial.label ?? '')
  const [href,  setHref]  = useState(initial.href  ?? '')
  const [badge, setBadge] = useState(initial.badge ?? '')

  return (
    <div>
      <div className="admin-form-group">
        <label className="admin-label admin-label-required">Label</label>
        <input className="admin-input" value={label} maxLength={30} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. About" />
      </div>
      <div className="admin-form-group">
        <label className="admin-label admin-label-required">URL / path</label>
        <input className="admin-input" value={href} maxLength={200} onChange={(e) => setHref(e.target.value)} placeholder="/about" />
      </div>
      <div className="admin-form-group">
        <label className="admin-label">Badge (optional)</label>
        <input className="admin-input" value={badge} maxLength={20} onChange={(e) => setBadge(e.target.value)} placeholder="e.g. New" />
      </div>
      <div className="admin-flex admin-gap-8" style={{ justifyContent: 'flex-end' }}>
        <button className="admin-btn admin-btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="admin-btn admin-btn-primary" disabled={saving || !label || !href} onClick={() => onSave({ label, href, badge })}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default function NavEditor({ initialItems, databaseAvailable = true }) {
  const [items, setItems]       = useState(initialItems)
  const [modal, setModal]       = useState(null) // { type: 'add'|'edit'|'addChild', item?, parentId? }
  const [saving, setSaving]     = useState(false)
  const [reordering, setReordering] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [err, setErr]           = useState('')

  async function handleSave(data) {
    if (!databaseAvailable) return
    setSaving(true)
    setErr('')
    try {
      if (modal.type === 'edit') {
        const res = await fetch(`/api/admin/navigation/${modal.item.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) { setErr((json.errors ?? [json.error]).join(', ')); return }
        setItems((prev) => prev.map((it) => {
          if (it.id === modal.item.id) return { ...it, ...json.item }
          return { ...it, children: it.children.map((c) => c.id === modal.item.id ? { ...c, ...json.item } : c) }
        }))
      } else {
        const parentId = modal.type === 'addChild' ? modal.parentId : undefined
        const res = await fetch('/api/admin/navigation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, parentId }),
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) { setErr((json.errors ?? [json.error]).join(', ')); return }
        if (parentId) {
          setItems((prev) => prev.map((it) =>
            it.id === parentId ? { ...it, children: [...it.children, json.item] } : it
          ))
        } else {
          setItems((prev) => [...prev, { ...json.item, children: [] }])
        }
      }
      setModal(null)
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!deleteId || !databaseAvailable) return
    const res = await fetch(`/api/admin/navigation/${deleteId}`, { method: 'DELETE' })
    if (res.ok) {
      setItems((prev) => prev
        .filter((it) => it.id !== deleteId)
        .map((it) => ({ ...it, children: it.children.filter((c) => c.id !== deleteId) }))
      )
    }
    setDeleteId(null)
  }

  async function toggleVisible(item) {
    if (!databaseAvailable) return
    const res = await fetch(`/api/admin/navigation/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVisible: !item.isVisible }),
    })
    if (res.ok) {
      setItems((prev) => prev.map((it) => {
        if (it.id === item.id) return { ...it, isVisible: !item.isVisible }
        return { ...it, children: it.children.map((c) => c.id === item.id ? { ...c, isVisible: !item.isVisible } : c) }
      }))
    }
  }

  async function moveItem(item, parentId, direction) {
    if (!databaseAvailable || reordering) return

    const currentItems = items
    const group = parentId
      ? currentItems.find((parent) => parent.id === parentId)?.children ?? []
      : currentItems
    const currentIndex = group.findIndex((entry) => entry.id === item.id)
    const destinationIndex = currentIndex + direction
    if (currentIndex < 0 || destinationIndex < 0 || destinationIndex >= group.length) return

    const reorderedGroup = [...group]
    ;[reorderedGroup[currentIndex], reorderedGroup[destinationIndex]] = [reorderedGroup[destinationIndex], reorderedGroup[currentIndex]]
    const updates = reorderedGroup.map((entry, index) => ({ id: entry.id, sortOrder: index }))
    const nextItems = parentId
      ? currentItems.map((parent) => parent.id === parentId ? { ...parent, children: reorderedGroup } : parent)
      : reorderedGroup

    setItems(nextItems)
    setReordering(item.id)
    setErr('')
    try {
      const res = await fetch('/api/admin/navigation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updates }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Could not change navigation order.')
      }
    } catch (error) {
      setItems(currentItems)
      setErr(error.message || 'Could not change navigation order.')
    } finally {
      setReordering('')
    }
  }

  function NavRow({ item, isChild = false, parentId = null, index, total }) {
    return (
      <div className={`admin-row-edit admin-navigation-row${isChild ? ' is-child' : ''}`}>
        <div className="admin-navigation-item">
          <span className="admin-navigation-title">{item.label}</span>
          {item.badge && <span className="admin-badge admin-badge-draft" style={{ marginLeft: 6 }}>{item.badge}</span>}
          {!item.isVisible && <span className="admin-badge admin-badge-locked" style={{ marginLeft: 6 }}>Hidden</span>}
          <span className="admin-navigation-path">{item.href}</span>
        </div>
        <div className="admin-navigation-controls">
          <label className="admin-toggle admin-navigation-toggle" onClick={(e) => e.stopPropagation()}>
            <input type="checkbox" checked={item.isVisible} disabled={!databaseAvailable} onChange={() => toggleVisible(item)} />
            <span className="admin-toggle-track" />
          </label>
          {!isChild && (
            <button disabled={!databaseAvailable} className="admin-btn admin-btn-secondary admin-btn-sm admin-navigation-action" onClick={() => setModal({ type: 'addChild', parentId: item.id })}>
              + Child
            </button>
          )}
          <div className="admin-navigation-order" aria-label={`Change position of ${item.label}`}>
            <button type="button" className="admin-btn admin-btn-icon admin-btn-ghost admin-navigation-icon" disabled={!databaseAvailable || !!reordering || index === 0} onClick={() => moveItem(item, parentId, -1)} aria-label={`Move ${item.label} up`} title="Move up"><MoveUp size={15} /></button>
            <button type="button" className="admin-btn admin-btn-icon admin-btn-ghost admin-navigation-icon" disabled={!databaseAvailable || !!reordering || index === total - 1} onClick={() => moveItem(item, parentId, 1)} aria-label={`Move ${item.label} down`} title="Move down"><MoveDown size={15} /></button>
          </div>
          <button type="button" disabled={!databaseAvailable} className="admin-btn admin-btn-icon admin-btn-secondary admin-navigation-icon" onClick={() => setModal({ type: 'edit', item })} aria-label={`Edit ${item.label}`} title="Edit"><Edit size={15} /></button>
          <button type="button" disabled={!databaseAvailable} className="admin-btn admin-btn-icon admin-btn-ghost admin-navigation-icon admin-navigation-delete" onClick={() => setDeleteId(item.id)} aria-label={`Delete ${item.label}`} title="Delete"><Delete size={15} /></button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {err && <div className="admin-alert admin-alert-error admin-mb-16">{err}</div>}

      {!databaseAvailable && (
        <div className="admin-alert admin-alert-warning admin-mb-16">
          Showing the current site navigation in preview mode. MongoDB is unavailable, so editing and adding items are disabled until it reconnects.
        </div>
      )}

      <div className="admin-card admin-mb-16">
        <div className="admin-card-header">
          <span className="admin-card-title">Navigation items ({items.length})</span>
          <button disabled={!databaseAvailable} className="admin-btn admin-btn-primary admin-btn-sm admin-navigation-add" onClick={() => setModal({ type: 'add' })}>
            <Add size={15} /> Add item
          </button>
        </div>

        {items.length === 0 ? (
          <div className="admin-card-body">
            <div className="admin-empty">
              <div className="admin-empty-icon">🔗</div>
              <p className="admin-empty-title">No navigation items</p>
              <p className="admin-text-muted">Run <code>npm run db:seed</code> or add items manually.</p>
            </div>
          </div>
        ) : (
          <div>
            {items.map((item, index) => (
              <div key={item.id}>
                <NavRow item={item} index={index} total={items.length} />
                {item.children.map((child, childIndex) => (
                  <NavRow key={child.id} item={child} isChild parentId={item.id} index={childIndex} total={item.children.length} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <Modal
          title={modal.type === 'edit' ? 'Edit item' : modal.type === 'addChild' ? 'Add child item' : 'Add nav item'}
          onClose={() => setModal(null)}
        >
          <ItemForm
            initial={modal.item}
            onSave={handleSave}
            onCancel={() => setModal(null)}
            saving={saving}
          />
        </Modal>
      )}

      {deleteId && (
        <Modal title="Delete nav item" onClose={() => setDeleteId(null)}>
          <p style={{ marginBottom: 16 }}>Delete this item and all its children? This cannot be undone.</p>
          <div className="admin-flex admin-gap-8" style={{ justifyContent: 'flex-end' }}>
            <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
            <button className="admin-btn admin-btn-danger" onClick={handleDelete}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
