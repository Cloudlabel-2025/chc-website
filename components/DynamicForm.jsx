'use client'

import { useState, useEffect } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u
const PHONE_RE = /^[0-9+ -]+$/u

function fieldError(field, value, isCheckbox) {
  const label = field.label || field.key
  if (field.required) {
    if (isCheckbox) {
      if (!value) return `${label} is required`
    } else if (!String(value ?? '').trim()) {
      return `${label} is required`
    }
  }
  const text = String(value ?? '')
  if (!text && !field.required) return null
  const max = field.maxLength ? parseInt(field.maxLength, 10) : null
  if (max && text.length > max) return `${label} must be ${max} characters or fewer`
  const min = field.minLength ? parseInt(field.minLength, 10) : null
  if (min && text.length < min) return `${label} must be at least ${min} characters`
  if (field.type === 'email' && text && !EMAIL_RE.test(text)) return `Invalid ${label.toLowerCase()}`
  if (field.type === 'tel' && text && !PHONE_RE.test(text)) return `Invalid ${label.toLowerCase()}`
  if (field.pattern && text) {
    try {
      if (!new RegExp(field.pattern).test(text)) return field.patternMessage || `Invalid ${label.toLowerCase()}`
    } catch {
      // Invalid regex on the definition — skip client pattern check; server still enforces.
    }
  }
  return null
}

export default function DynamicForm({ slug }) {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    fetch(`/api/public/forms/${slug}`)
      .then((r) => r.json())
      .then((d) => { if (d.form) setForm(d.form) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})
    setSuccess('')
    const formElement = e.currentTarget
    const fd = new FormData(formElement)
    const body = {}
    for (const field of form.fields ?? []) {
      if (field.type === 'checkbox') {
        body[field.key] = fd.get(field.key) === 'on' || fd.get(field.key) === 'true'
      } else {
        body[field.key] = fd.get(field.key)?.toString() ?? ''
      }
    }
    const clientErrors = {}
    for (const field of form.fields ?? []) {
      const message = fieldError(field, body[field.key], field.type === 'checkbox')
      if (message) clientErrors[field.key] = [message]
    }
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors)
      const first = form.fields.find((f) => clientErrors[f.key])
      if (first) formElement.querySelector(`[name="${first.key}"]`)?.focus()
      return
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
        if (data.fieldErrors) {
          setErrors(data.fieldErrors)
        } else if (data.errors) {
          const map = {}
          data.errors.forEach((msg) => { map._general = (map._general ? map._general + ', ' : '') + msg })
          setErrors(map)
        } else {
          setErrors({ _general: data.error || 'Submission failed.' })
        }
        return
      }
      setSuccess(data.message || form.successMessage || 'Submitted successfully.')
      formElement.reset()
      setShowSuccessModal(true)
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
      {success && !showSuccessModal && <div className="col-12"><div className="admin-alert admin-alert-success">{success}</div></div>}
      {(form.fields ?? []).map((field) => (
        <div key={field.key} className={field.type === 'textarea' ? 'col-md-12 mb-30px' : 'col-md-6 mb-30px'}>
          <label className="admin-label" style={{ color: '#fff', marginBottom: 6 }}>{field.label}{field.required && ' *'}</label>
          {field.type === 'textarea' ? (
            <textarea name={field.key} placeholder={field.placeholder} required={field.required} maxLength={field.maxLength} rows={field.rows ?? 4} className="box-shadow-quadruple-large form-control" aria-invalid={Boolean(errors[field.key]?.[0])} />
          ) : field.type === 'select' ? (
            <select name={field.key} required={field.required} defaultValue="" className="box-shadow-quadruple-large form-control form-select" aria-invalid={Boolean(errors[field.key]?.[0])}>
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
            <input type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : field.type === 'tel' ? 'tel' : field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : 'text'} name={field.key} placeholder={field.placeholder} required={field.required} maxLength={field.maxLength} className="box-shadow-quadruple-large form-control" aria-invalid={Boolean(errors[field.key]?.[0])} />
          )}
          {field.helpText && <p className="admin-field-hint" style={{ color: 'rgba(255,255,255,0.7)' }}>{field.helpText}</p>}
          {errors[field.key]?.[0] && <p className="text-danger" role="alert">{errors[field.key][0]}</p>}
        </div>
      ))}
      <div className="col-12 text-center">
        <button className="btn btn-medium btn-gradient-purple-pink btn-round-edge submit" type="submit" disabled={submitting}>
          {submitting ? 'Sending…' : form.buttonText || 'Submit'}
        </button>
      </div>
      {showSuccessModal && (
        <div role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setShowSuccessModal(false) }} style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(12, 16, 36, .72)' }}>
          <div role="dialog" aria-modal="true" aria-labelledby="dynamic-form-success-title" style={{ width: 'min(520px, 100%)', background: '#fff', borderRadius: 16, padding: '36px 30px 30px', textAlign: 'center', boxShadow: '0 24px 80px rgba(0,0,0,.28)' }}>
            <div aria-hidden="true" style={{ width: 56, height: 56, margin: '0 auto 18px', borderRadius: '50%', display: 'grid', placeItems: 'center', background: '#e8f7ef', color: '#16834b', fontSize: 28 }}>✓</div>
            <h2 id="dynamic-form-success-title" style={{ marginBottom: 12, color: '#202338' }}>Thank you</h2>
            <p style={{ marginBottom: 24, color: '#555b70', lineHeight: 1.65 }}>{form.successMessage || success || 'Submitted successfully.'}</p>
            <button type="button" className="btn btn-medium btn-gradient-purple-pink btn-round-edge" onClick={() => setShowSuccessModal(false)}>Close</button>
          </div>
        </div>
      )}
    </form>
  )
}