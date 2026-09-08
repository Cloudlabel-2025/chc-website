'use client'

import { useState } from 'react'

function Field({ label, error }) {
  return null // helper placeholder
}

export function ContactForm({ formFields = {} }) {
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    setStatus('loading'); setMessage(''); setFormError('')
    const fd = new FormData(e.currentTarget)
    const body = Object.fromEntries(fd.entries())
    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = data.errors ? data.errors.join(', ') : (data.error ?? 'Failed to send message.')
        setStatus('error'); setMessage(msg); setFormError(msg)
        return
      }
      setStatus('success'); setMessage(data.message ?? 'Message sent — we\'ll be in touch.')
      e.currentTarget.reset()
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

  return (
    <form onSubmit={onSubmit} className="row contact-form-style-02" noValidate>
      <div className="col-md-6 mb-30px">
        <input className="box-shadow-quadruple-large input-name form-control required" type="text" name="name" placeholder={f.namePlaceholder} required />
      </div>
      <div className="col-md-6 mb-30px">
        <input className="box-shadow-quadruple-large form-control required" type="email" name="email" placeholder={f.emailPlaceholder} required />
      </div>
      <div className="col-md-6 mb-30px">
        <input className="box-shadow-quadruple-large form-control" type="tel" name="phone" placeholder={f.phonePlaceholder} />
      </div>
      <div className="col-md-6 mb-30px">
        <input className="box-shadow-quadruple-large form-control" type="text" name="subject" placeholder={f.subjectPlaceholder} />
      </div>
      <div className="col-md-12 mb-30px">
        <textarea className="box-shadow-quadruple-large form-control" cols="40" rows="4" name="comment" placeholder={f.commentPlaceholder}></textarea>
      </div>
      <div className="col-md-7 last-paragraph-no-margin">
        <p className="text-center text-md-start fs-16">{f.privacyText}</p>
      </div>
      <div className="col-md-5 text-center text-md-end sm-mt-20px">
        <button className="btn btn-medium btn-dark-gray btn-box-shadow btn-round-edge submit" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'sending…' : f.buttonText}
        </button>
      </div>
      {message && (
        <div className="col-12"><div className={`form-results mt-20px ${status === 'success' ? 'text-success' : 'text-danger'}`}>{message}</div></div>
      )}
    </form>
  )
}

export function GiveOneHourForm({ formFields = {} }) {
  const [status, setStatus] = useState(null)
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  async function onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    setStatus('loading'); setMessage(''); setFieldErrors({})
    const fd = new FormData(e.currentTarget)
    const body = Object.fromEntries(fd.entries())
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
      e.currentTarget.reset()
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
        <input className="box-shadow-quadruple-large input-name form-control required" type="text" name="full_name" placeholder={f.fullNamePlaceholder} required aria-invalid={Boolean(errorFor('full_name'))} />
        {errorFor('full_name') && <small className="text-danger d-block mt-5px">{errorFor('full_name')}</small>}
      </div>
      <div className="col-md-6 mb-30px">
        <input className="box-shadow-quadruple-large form-control required" type="url" name="linkedin" placeholder={f.linkedinPlaceholder} required aria-invalid={Boolean(errorFor('linkedin'))} />
        {errorFor('linkedin') && <small className="text-danger d-block mt-5px">{errorFor('linkedin')}</small>}
      </div>
      <div className="col-md-6 mb-30px">
        <input className="box-shadow-quadruple-large form-control required" type="text" name="organisation" placeholder={f.orgPlaceholder} required aria-invalid={Boolean(errorFor('organisation'))} />
        {errorFor('organisation') && <small className="text-danger d-block mt-5px">{errorFor('organisation')}</small>}
      </div>
      <div className="col-md-6 mb-30px">
        <input className="box-shadow-quadruple-large form-control required" type="text" name="role" placeholder={f.rolePlaceholder} required aria-invalid={Boolean(errorFor('role'))} />
        {errorFor('role') && <small className="text-danger d-block mt-5px">{errorFor('role')}</small>}
      </div>
      <div className="col-md-12 mb-30px">
        <input className="box-shadow-quadruple-large form-control required" type="text" name="expertise" placeholder={f.expertisePlaceholder} required aria-invalid={Boolean(errorFor('expertise'))} />
        {errorFor('expertise') && <small className="text-danger d-block mt-5px">{errorFor('expertise')}</small>}
      </div>
      <div className="col-md-12 mb-30px">
        <textarea className="box-shadow-quadruple-large form-control required" cols="40" rows="4" name="how_to_help" placeholder={f.helpPlaceholder} required aria-invalid={Boolean(errorFor('how_to_help'))}></textarea>
        {errorFor('how_to_help') && <small className="text-danger d-block mt-5px">{errorFor('how_to_help')}</small>}
      </div>
      <div className="col-md-6 mb-30px">
        <input className="box-shadow-quadruple-large form-control required" type="text" name="availability" placeholder={f.availabilityPlaceholder} required aria-invalid={Boolean(errorFor('availability'))} />
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
        <textarea className="box-shadow-quadruple-large form-control" cols="40" rows="4" name="anything_else" placeholder="Anything you'd like us to know?"></textarea>
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
