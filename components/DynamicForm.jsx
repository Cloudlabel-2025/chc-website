'use client'

import { useState, useEffect } from 'react'

export default function DynamicForm({ slug }) {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetch(`/api/admin/forms/${slug}`)
      .then((r) => r.json())
      .then((d) => { if (d.form) setForm(d.form) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  // Public fetch fallback: try public endpoint if admin fetch fails (for logged-out visitors)
  useEffect(() => {
    if (form) return
    fetch(`/api/public/forms/${slug}`)
      .then((r) => r.json())
      .then((d) => { if (d.form) setForm(d.form) })
      .catch(() => {})
  }, [slug, form])

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})
    setSuccess('')
    const fd = new FormData(e.currentTarget)
    const body = {}
    for (const field of form.fields ?? []) {
      if (field.type === 'checkbox') {
        body[field.key] = fd.get(field.key) === 'on' || fd.get(field.key) === 'true'
      } else {
        body[field.key] = fd.get(field.key)?.toString() ?? ''
      }
    }
    setSubmitting(true)
    try {
      const res = await fetch(`/api/public/forms/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.errors) {
          const map = {}
          data.errors.forEach((msg) => { map._general = (map._general ? map._general + ', ' : '') + msg })
          setErrors(map)
        } else {
          setErrors({ _general: data.error || 'Submission failed.' })
        }
        return
      }
      setSuccess(data.message || form.successMessage || 'Submitted successfully.')
      e.currentTarget.reset()
      setTimeout(() => setSuccess(''), 5000)
    } catch {
      setErrors({ _general: 'Network error. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="admin-text-muted">Loading form…</p>
  if (!form) return <p className="admin-text-muted">Form not found.</p>
  if (!form.isActive) return <div className="admin-alert admin-alert-warning">This form is currently unavailable.</div>

  return (
    <form onSubmit={handleSubmit} className="row contact-form-style-02" noValidate>
      {errors._general && <div className="col-12"><div className="admin-alert admin-alert-error">{errors._general}</div></div>}
      {success && <div className="col-12"><div className="admin-alert admin-alert-success">{success}</div></div>}
      {(form.fields ?? []).map((field) => (
        <div key={field.key} className={field.type === 'textarea' ? 'col-md-12 mb-30px' : 'col-md-6 mb-30px'}>
          <label className="admin-label" style={{ color: '#fff', marginBottom: 6 }}>{field.label}{field.required && ' *'}</label>
          {field.type === 'textarea' ? (
            <textarea name={field.key} placeholder={field.placeholder} required={field.required} maxLength={field.maxLength} rows={field.rows ?? 4} className="box-shadow-quadruple-large form-control" />
          ) : field.type === 'select' ? (
            <select name={field.key} required={field.required} className="box-shadow-quadruple-large form-control form-select" defaultValue="">
              <option value="" disabled>{field.placeholder || `Select ${field.label}`}</option>
              {(field.options ?? []).map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : field.type === 'radio' ? (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {(field.options ?? []).map((opt) => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff' }}>
                  <input type="radio" name={field.key} value={opt} required={field.required} /> {opt}
                </label>
              ))}
            </div>
          ) : field.type === 'checkbox' ? (
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff' }}>
              <input type="checkbox" name={field.key} required={field.required} /> {field.placeholder || field.label}
            </label>
          ) : (
            <input type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : field.type === 'tel' ? 'tel' : field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : 'text'} name={field.key} placeholder={field.placeholder} required={field.required} maxLength={field.maxLength} className="box-shadow-quadruple-large form-control" />
          )}
          {field.helpText && <p className="admin-field-hint" style={{ color: 'rgba(255,255,255,0.7)' }}>{field.helpText}</p>}
        </div>
      ))}
      <div className="col-12 text-center">
        <button className="btn btn-medium btn-gradient-purple-pink btn-round-edge submit" type="submit" disabled={submitting}>
          {submitting ? 'Sending…' : form.buttonText || 'Submit'}
        </button>
      </div>
    </form>
  )
}
