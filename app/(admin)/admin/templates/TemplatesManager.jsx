'use client'

import { useMemo, useState } from 'react'

function sectionCount(template) { return template?.content?.sections?.length ?? 0 }

export default function TemplatesManager({ initialTemplates = [], pages = [], catalogue = [] }) {
  const [templates, setTemplates] = useState(initialTemplates)
  const [targetPageId, setTargetPageId] = useState(pages[0]?.id ?? '')
  const [busy, setBusy] = useState('')
  const [message, setMessage] = useState('')
  const savedByName = useMemo(() => new Map(templates.map((template) => [template.name, template])), [templates])

  async function addTemplate(template) {
    setBusy(`add:${template.name}`); setMessage('')
    try {
      const response = await fetch('/api/admin/templates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(template) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not add this template.')
      setTemplates((current) => [data.template, ...current])
      setMessage(`“${data.template.name}” is now available in your CMS.`)
    } catch (error) { setMessage(error.message || 'Could not add this template.') }
    finally { setBusy('') }
  }

  async function applyTemplate(template) {
    if (!targetPageId) { setMessage('Create or select a CMS page before applying a template.'); return }
    const page = pages.find((entry) => entry.id === targetPageId)
    if (!window.confirm(`Add the “${template.name}” layout to “${page?.title || 'this page'}”? Existing CMS content will be kept.`)) return
    setBusy(`apply:${template.id}`); setMessage('')
    try {
      const response = await fetch(`/api/admin/templates/${template.id}/apply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pageId: targetPageId }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not apply this template.')
      setMessage(`Template added to “${page?.title}”. You can now edit its sections and images from Pages.`)
    } catch (error) { setMessage(error.message || 'Could not apply this template.') }
    finally { setBusy('') }
  }

  async function refreshTemplate(saved, catalogueTemplate) {
    if (!window.confirm(`Refresh “${saved.name}” with the latest CHC layout fields? This does not change pages that already use it.`)) return
    setBusy(`refresh:${saved.id}`); setMessage('')
    try {
      const response = await fetch('/api/admin/templates', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: saved.id, description: catalogueTemplate.description, content: catalogueTemplate.content }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not refresh this template.')
      setTemplates((current) => current.map((entry) => entry.id === data.template.id ? data.template : entry))
      setMessage(`“${data.template.name}” now includes the latest editable fields.`)
    } catch (error) { setMessage(error.message || 'Could not refresh this template.') }
    finally { setBusy('') }
  }

  return <div className="admin-template-manager">
    <div className="admin-template-toolbar admin-card"><div><span className="admin-card-title">Apply a layout</span><p className="admin-text-muted admin-text-sm">Templates add missing sections and never replace content you have already edited.</p></div><label className="admin-template-page-select"><span>Target page</span><select className="admin-select" value={targetPageId} onChange={(event) => setTargetPageId(event.target.value)}>{pages.length ? pages.map((page) => <option key={page.id} value={page.id}>{page.title} (/{page.slug})</option>) : <option value="">No CMS pages available</option>}</select></label></div>
    {message && <div className="admin-alert admin-alert-success admin-mb-16">{message}</div>}
    <div className="admin-template-grid">{catalogue.map((template) => {
      const saved = savedByName.get(template.name); const adding = busy === `add:${template.name}`; const applying = saved && busy === `apply:${saved.id}`
      return <article className="admin-template-card" key={template.name}><div className="admin-template-card-top"><span className="admin-template-chip">{sectionCount(template)} sections</span><span className="admin-template-status">{saved ? 'Ready to use' : 'Library layout'}</span></div><h2>{template.name.replace('CHC — ', '')}</h2><p>{template.description}</p><div className="admin-template-section-list">{(template.content?.sections ?? []).slice(0, 5).map((section) => <span key={section.sectionKey}>{section.sectionKey}</span>)}{sectionCount(template) > 5 && <span>+{sectionCount(template) - 5} more</span>}</div><div className="admin-template-actions">{saved ? <button className="admin-btn admin-btn-primary" onClick={() => applyTemplate(saved)} disabled={Boolean(busy) || !pages.length}>{applying ? 'Applying…' : 'Apply to page'}</button> : <button className="admin-btn admin-btn-secondary" onClick={() => addTemplate(template)} disabled={Boolean(busy)}>{adding ? 'Adding…' : 'Add to CMS'}</button>}</div></article>
    })}</div>
    {templates.length > 0 && <div className="admin-card admin-mb-16"><div className="admin-card-header"><span className="admin-card-title">Refresh saved layouts</span><span className="admin-text-muted admin-text-sm">Updates template fields only; pages remain unchanged.</span></div><div className="admin-card-body">{templates.map((saved) => { const latest = catalogue.find((entry) => entry.name === saved.name); return latest ? <div key={saved.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '8px 0' }}><span>{saved.name.replace('CHC — ', '')}</span><button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => refreshTemplate(saved, latest)} disabled={Boolean(busy)}>{busy === `refresh:${saved.id}` ? 'Refreshing…' : 'Refresh layout'}</button></div> : null })}</div></div>}
    <div className="admin-card admin-template-saved"><div className="admin-card-header"><span className="admin-card-title">Saved templates</span><span className="admin-text-muted admin-text-sm">{templates.length} available</span></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Sections</th><th>Updated</th></tr></thead><tbody>{templates.length ? templates.map((template) => <tr key={template.id}><td style={{ fontWeight: 600 }}>{template.name}</td><td>{sectionCount(template)}</td><td className="admin-text-muted admin-text-sm" suppressHydrationWarning>{new Date(template.updatedAt).toLocaleDateString('en-AU')}</td></tr>) : <tr><td colSpan="3" className="admin-text-muted">Add a layout above to make it reusable across pages.</td></tr>}</tbody></table></div></div>
  </div>
}
