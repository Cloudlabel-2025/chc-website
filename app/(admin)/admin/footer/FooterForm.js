'use client'

import { useState } from 'react'

const EMPTY = {
  address1Label: '', address1Text: '',
  address2Label: '', address2Text: '',
  ctaText: '', ctaLinkText: '', ctaLinkHref: '',
  copyrightText: '',
  facebookUrl: '', instagramUrl: '', youtubeUrl: '', linkedinUrl: '',
}

function Field({ label, value, onChange, maxLength, placeholder, hint }) {
  return (
    <div className="admin-form-group">
      <label className="admin-label">{label}</label>
      <input
        className="admin-input"
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {maxLength && (
        <p className={`admin-char-count ${value.length > maxLength * 0.9 ? 'warn' : ''}`}>
          {value.length}/{maxLength}
        </p>
      )}
      {hint && <p className="admin-field-hint">{hint}</p>}
    </div>
  )
}

export default function FooterForm({ initial }) {
  const [form, setForm] = useState(initial ?? EMPTY)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState('')
  const [err, setErr]       = useState('')

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true)
    setMsg('')
    setErr('')
    try {
      const res = await fetch('/api/admin/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setErr((data.errors ?? [data.error]).join(', ')); return }
      setMsg('Footer saved.')
      setTimeout(() => setMsg(''), 3000)
    } catch { setErr('Network error') }
    finally { setSaving(false) }
  }

  return (
    <div>
      <div className="admin-grid-2 admin-mb-16" style={{ alignItems: 'start' }}>

        {/* Addresses */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Addresses</span></div>
          <div className="admin-card-body">
            <Field label="Address 1 — label" value={form.address1Label} onChange={(v) => set('address1Label', v)} maxLength={60} placeholder="e.g. Australia" />
            <Field label="Address 1 — text"  value={form.address1Text}  onChange={(v) => set('address1Text', v)}  maxLength={200} />
            <Field label="Address 2 — label" value={form.address2Label} onChange={(v) => set('address2Label', v)} maxLength={60} placeholder="e.g. United Kingdom" />
            <Field label="Address 2 — text"  value={form.address2Text}  onChange={(v) => set('address2Text', v)}  maxLength={200} />
          </div>
        </div>

        {/* CTA + Copyright */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">CTA &amp; Copyright</span></div>
          <div className="admin-card-body">
            <Field label="CTA text"      value={form.ctaText}      onChange={(v) => set('ctaText', v)}      maxLength={100} />
            <Field label="CTA link label" value={form.ctaLinkText} onChange={(v) => set('ctaLinkText', v)} maxLength={60} />
            <Field label="CTA link URL"   value={form.ctaLinkHref} onChange={(v) => set('ctaLinkHref', v)} maxLength={200} placeholder="/contact" />
            <Field label="Copyright text" value={form.copyrightText} onChange={(v) => set('copyrightText', v)} maxLength={100} placeholder="© 2025 CHC. All rights reserved." />
          </div>
        </div>

        {/* Social links */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Social links</span></div>
          <div className="admin-card-body">
            <Field label="Facebook URL"  value={form.facebookUrl}  onChange={(v) => set('facebookUrl', v)}  maxLength={200} placeholder="https://facebook.com/…" />
            <Field label="Instagram URL" value={form.instagramUrl} onChange={(v) => set('instagramUrl', v)} maxLength={200} placeholder="https://instagram.com/…" />
            <Field label="YouTube URL"   value={form.youtubeUrl}   onChange={(v) => set('youtubeUrl', v)}   maxLength={200} placeholder="https://youtube.com/…" />
            <Field label="LinkedIn URL"  value={form.linkedinUrl}  onChange={(v) => set('linkedinUrl', v)}  maxLength={200} placeholder="https://linkedin.com/…" />
          </div>
        </div>
      </div>

      {err && <div className="admin-alert admin-alert-error admin-mb-16">{err}</div>}
      {msg && <div className="admin-alert admin-alert-success admin-mb-16">{msg}</div>}

      <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
        {saving ? 'Saving…' : 'Save footer'}
      </button>
    </div>
  )
}
