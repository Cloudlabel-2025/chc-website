'use client'

import { useState, useEffect } from 'react'
import { validateGiveOneHour, GIVE_ONE_HOUR_AVAILABILITY, validateContact, CONTACT_SUBJECTS } from '@/lib/cms/form-validation'

function Field({ label, error }) {
  return null // helper placeholder
}

export function ContactForm({ formFields = {} }) {
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  useEffect(() => { if (status === 'success') setShowSuccessModal(true) }, [status])

  async function onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    setStatus(null); setMessage(''); setFieldErrors({})
    const form = e.currentTarget
    const fd = new FormData(form)
    const body = Object.fromEntries(fd.entries())
    const clientErrors = validateContact(body)
    if (Object.keys(clientErrors).length) {
      setStatus('error'); setFieldErrors(clientErrors)
      form.querySelector(`[name="${Object.keys(clientErrors)[0]}"]`)?.focus()
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = data.errors ? data.errors.join(', ') : (data.error ?? 'Failed to send message.')
        setStatus('error'); setMessage(msg); setFieldErrors(data.fieldErrors ?? {})
        return
      }
      setStatus('success'); setMessage(data.message ?? 'Thanks — your message has been sent.')
      form.reset()
    } catch {
      setStatus('error'); setMessage('Network error — please try again.')
    }
  }

  const f = {
    namePlaceholder: formFields.namePlaceholder ?? 'Your name*',
    emailPlaceholder: formFields.emailPlaceholder ?? 'Your email address*',
    phonePlaceholder: formFields.phonePlaceholder ?? 'Your phone',
    subjectPlaceholder: formFields.subjectPlaceholder ?? 'Your subject',
    commentPlaceholder: formFields.commentPlaceholder ?? 'Your message',
    privacyText: formFields.privacyText ?? 'We are committed to protecting your privacy. We will never collect information about you without your explicit consent.',
    buttonText: formFields.buttonText ?? 'send message',
    successText: formFields.successText ?? 'Thanks — your message has been sent.',
    ...formFields,
  }

  const errorFor = (name) => fieldErrors[name]?.[0]

  return (
    <form onSubmit={onSubmit} className="row contact-form-style-02" noValidate>
      <div className="col-md-6 mb-30px">
        <input maxLength="100" className="box-shadow-quadruple-large input-name form-control required" type="text" name="name" placeholder={f.namePlaceholder} required aria-invalid={Boolean(errorFor('name'))} />
        {errorFor('name') && <small className="text-danger d-block mt-5px">{errorFor('name')}</small>}
      </div>
      <div className="col-md-6 mb-30px">
        <input maxLength="254" className="box-shadow-quadruple-large form-control required" type="email" name="email" placeholder={f.emailPlaceholder} required aria-invalid={Boolean(errorFor('email'))} />
        {errorFor('email') && <small className="text-danger d-block mt-5px">{errorFor('email')}</small>}
      </div>
      <div className="col-md-6 mb-30px">
        <input maxLength="25" className="box-shadow-quadruple-large form-control" type="tel" name="phone" placeholder={f.phonePlaceholder} aria-invalid={Boolean(errorFor('phone'))} />
        {errorFor('phone') && <small className="text-danger d-block mt-5px">{errorFor('phone')}</small>}
      </div>
      <div className="col-md-6 mb-30px">
        <select className="box-shadow-quadruple-large form-control required form-select" name="subject" defaultValue="" required aria-invalid={Boolean(errorFor('subject'))}>
          <option value="" disabled>{f.subjectPlaceholder}</option>
          {CONTACT_SUBJECTS.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        {errorFor('subject') && <small className="text-danger d-block mt-5px">{errorFor('subject')}</small>}
      </div>
      <div className="col-md-12 mb-30px">
        <textarea maxLength="2000" className="box-shadow-quadruple-large form-control" cols="40" rows="4" name="comment" placeholder={f.commentPlaceholder} aria-invalid={Boolean(errorFor('comment'))}></textarea>
        {errorFor('comment') && <small className="text-danger d-block mt-5px">{errorFor('comment')}</small>}
      </div>
      <div className="col-md-7 last-paragraph-no-margin">
        <p className="text-center text-md-start fs-16">{f.privacyText}</p>
      </div>
      <div className="col-md-5 text-center text-md-end sm-mt-20px">
        <button className="btn btn-medium btn-dark-gray btn-box-shadow btn-round-edge submit" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'sending…' : f.buttonText}
        </button>
      </div>
      {message && status === 'error' && (
        <div className="col-12"><div className="form-results mt-20px text-danger">{message}</div></div>
      )}
      {showSuccessModal && (
        <div role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setShowSuccessModal(false) }} style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(12, 16, 36, .72)' }}>
          <div role="dialog" aria-modal="true" aria-labelledby="contact-success-title" style={{ width: 'min(520px, 100%)', background: '#fff', borderRadius: 16, padding: '36px 30px 30px', textAlign: 'center', boxShadow: '0 24px 80px rgba(0,0,0,.28)' }}>
            <div aria-hidden="true" style={{ width: 56, height: 56, margin: '0 auto 18px', borderRadius: '50%', display: 'grid', placeItems: 'center', background: '#e8f7ef', color: '#16834b', fontSize: 28 }}>✓</div>
            <h2 id="contact-success-title" style={{ marginBottom: 12, color: '#202338' }}>Thank you</h2>
            <p style={{ marginBottom: 24, color: '#555b70', lineHeight: 1.65 }}>{f.successText}</p>
            <button type="button" className="btn btn-medium btn-gradient-purple-pink btn-round-edge" onClick={() => setShowSuccessModal(false)}>Close</button>
          </div>
        </div>
      )}
    </form>
  )
}

export function GiveOneHourForm({ formFields = {} }) {
  const [status, setStatus] = useState(null)
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  useEffect(() => { if (status === 'success') setShowSuccessModal(true) }, [status])

  async function onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    setStatus(null); setMessage(''); setFieldErrors({})
    const form = e.currentTarget
    const fd = new FormData(form)
    const body = Object.fromEntries(fd.entries())
    const clientErrors = validateGiveOneHour(body)
    if (Object.keys(clientErrors).length) {
      setStatus('error'); setFieldErrors(clientErrors)
      form.querySelector(`[name="${Object.keys(clientErrors)[0]}"]`)?.focus()
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/public/give-one-hour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = data.errors ? data.errors.join(', ') : (data.error ?? 'Failed to submit.')
        setStatus('error'); setMessage(msg); setFieldErrors(data.fieldErrors ?? {}); return
      }
      setStatus('success'); setMessage(data.message ?? 'Thank you — we\'ll be in touch.')
      form.reset()
    } catch {
      setStatus('error'); setMessage('Network error — please try again.')
    }
  }

  const f = {
    fullNamePlaceholder: formFields.fullNamePlaceholder ?? 'Your full name*',
    linkedinPlaceholder: formFields.linkedinPlaceholder ?? 'LinkedIn profile URL*',
    orgPlaceholder: formFields.orgPlaceholder ?? 'Your organisation*',
    rolePlaceholder: formFields.rolePlaceholder ?? 'Your role*',
    expertisePlaceholder: formFields.expertisePlaceholder ?? 'Area of expertise*',
    helpPlaceholder: formFields.helpPlaceholder ?? 'How would you like to help?*',
    availabilityPlaceholder: formFields.availabilityPlaceholder ?? 'Preferred availability*',
    consentText: formFields.consentText ?? 'By submitting this form you agree to be contacted by CHC regarding volunteering opportunities.',
    buttonText: formFields.buttonText ?? 'Give My One Hour',
    successText: formFields.successText ?? 'Thank you for your interest. We will be in touch shortly.',
    ...formFields,
  }

  const errorFor = (name) => fieldErrors[name]?.[0]

  return (
    <form onSubmit={onSubmit} className="row contact-form-style-02" noValidate>
      <div className="col-md-6 mb-30px">
        <input maxLength="80" className="box-shadow-quadruple-large input-name form-control required" type="text" name="full_name" placeholder={f.fullNamePlaceholder} required aria-invalid={Boolean(errorFor('full_name'))} />
        {errorFor('full_name') && <small className="text-danger d-block mt-5px">{errorFor('full_name')}</small>}
      </div>
      <div className="col-md-6 mb-30px">
        <input className="box-shadow-quadruple-large form-control required" type="url" name="linkedin" placeholder={f.linkedinPlaceholder} required aria-invalid={Boolean(errorFor('linkedin'))} />
        {errorFor('linkedin') && <small className="text-danger d-block mt-5px">{errorFor('linkedin')}</small>}
      </div>
      <div className="col-md-6 mb-30px">
        <input maxLength="120" className="box-shadow-quadruple-large form-control required" type="text" name="organisation" placeholder={f.orgPlaceholder} required aria-invalid={Boolean(errorFor('organisation'))} />
        {errorFor('organisation') && <small className="text-danger d-block mt-5px">{errorFor('organisation')}</small>}
      </div>
      <div className="col-md-6 mb-30px">
        <input maxLength="80" className="box-shadow-quadruple-large form-control required" type="text" name="role" placeholder={f.rolePlaceholder} required aria-invalid={Boolean(errorFor('role'))} />
        {errorFor('role') && <small className="text-danger d-block mt-5px">{errorFor('role')}</small>}
      </div>
      <div className="col-md-12 mb-30px">
        <input maxLength="160" className="box-shadow-quadruple-large form-control required" type="text" name="expertise" placeholder={f.expertisePlaceholder} required aria-invalid={Boolean(errorFor('expertise'))} />
        {errorFor('expertise') && <small className="text-danger d-block mt-5px">{errorFor('expertise')}</small>}
      </div>
      <div className="col-md-12 mb-30px">
        <textarea maxLength="1000" className="box-shadow-quadruple-large form-control required" cols="40" rows="4" name="how_to_help" placeholder={f.helpPlaceholder} required aria-invalid={Boolean(errorFor('how_to_help'))}></textarea>
        {errorFor('how_to_help') && <small className="text-danger d-block mt-5px">{errorFor('how_to_help')}</small>}
      </div>
      <div className="col-md-6 mb-30px">
        <select className="box-shadow-quadruple-large form-control required form-select" name="availability" defaultValue="" required aria-invalid={Boolean(errorFor('availability'))}>
          <option value="" disabled>{f.availabilityPlaceholder}</option>
          {GIVE_ONE_HOUR_AVAILABILITY.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        {errorFor('availability') && <small className="text-danger d-block mt-5px">{errorFor('availability')}</small>}
      </div>
      <div className="col-md-6 mb-30px">
        <select className="box-shadow-quadruple-large form-control required form-select" name="format" defaultValue="" aria-invalid={Boolean(errorFor('format'))}>
          <option value="" disabled>Online / In person*</option>
          <option value="online">Online</option>
          <option value="in_person">In Person</option>
          <option value="both">Both</option>
        </select>
        {errorFor('format') && <small className="text-danger d-block mt-5px">{errorFor('format')}</small>}
      </div>
      <div className="col-md-12 mb-30px">
        <textarea maxLength="1000" className="box-shadow-quadruple-large form-control" cols="40" rows="4" name="anything_else" placeholder="Anything you'd like us to know?"></textarea>
      </div>
      <div className="col-md-12 mt-10px mb-10px">
        <p className="text-center text-md-start fs-16">{f.consentText}</p>
      </div>
      <div className="col-md-12 text-center">
        <button className="btn btn-medium btn-gradient-purple-pink btn-round-edge submit" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'sending…' : f.buttonText}
        </button>
      </div>
      {message && (
        <div className="col-12"><div className={`form-results mt-20px text-center ${status === 'success' ? 'text-success' : 'text-danger'}`}>{message}</div></div>
      )}
      {showSuccessModal && (
        <div role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setShowSuccessModal(false) }} style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(12, 16, 36, .72)' }}>
          <div role="dialog" aria-modal="true" aria-labelledby="give-one-hour-success-title" style={{ width: 'min(520px, 100%)', background: '#fff', borderRadius: 16, padding: '36px 30px 30px', textAlign: 'center', boxShadow: '0 24px 80px rgba(0,0,0,.28)' }}>
            <div aria-hidden="true" style={{ width: 56, height: 56, margin: '0 auto 18px', borderRadius: '50%', display: 'grid', placeItems: 'center', background: '#e8f7ef', color: '#16834b', fontSize: 28 }}>✓</div>
            <h2 id="give-one-hour-success-title" style={{ marginBottom: 12, color: '#202338' }}>Thank you</h2>
            <p style={{ marginBottom: 24, color: '#555b70', lineHeight: 1.65 }}>A member of CHC will contact you to arrange the most useful session based on your experience and availability.</p>
            <button type="button" className="btn btn-medium btn-gradient-purple-pink btn-round-edge" onClick={() => setShowSuccessModal(false)}>Close</button>
          </div>
        </div>
      )}
    </form>
  )
}

export function NewsletterForm({ placeholder, successMessage: cmsSuccess }) {
  const [status, setStatus] = useState(null)
  const [message, setMessage] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    setStatus('loading'); setMessage('')
    const fd = new FormData(e.currentTarget)
    const email = fd.get('email')?.toString() ?? ''
    try {
      const res = await fetch('/api/public/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = data.errors ? data.errors.join(', ') : (data.error ?? 'Failed to subscribe.')
        setStatus('error'); setMessage(msg); return
      }
      setStatus('success'); setMessage(data.message ?? cmsSuccess ?? 'Subscribed — thank you!')
      e.currentTarget.reset()
    } catch {
      setStatus('error'); setMessage('Network error — please try again.')
    }
  }

  return (
    <form onSubmit={onSubmit} className="position-relative w-100" noValidate>
      <input className="bg-transparent border-color-transparent-white-light w-100 form-control required" type="email" name="email" placeholder={placeholder ?? 'Enter your email...'} required />
      <button type="submit" className="btn submit" aria-label="submit" disabled={status === 'loading'}>
        <i className="icon bi bi-envelope icon-small text-white"></i>
      </button>
      {message && (
        <div className={`form-results border-radius-4px pt-5px pb-5px ps-15px pe-15px fs-14 lh-22 mt-10px w-100 text-center ${status === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}`}>
          {message}
        </div>
      )}
    </form>
  )
}
