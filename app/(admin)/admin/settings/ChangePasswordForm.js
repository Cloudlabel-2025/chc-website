'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { changePasswordAction } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button className="admin-btn admin-btn-primary" type="submit" disabled={pending}>
      {pending ? 'Updating…' : 'Update password'}
    </button>
  )
}

export default function ChangePasswordForm() {
  const [state, action] = useFormState(changePasswordAction, null)

  return (
    <form action={action}>
      {state?.error && (
        <div className="admin-alert admin-alert-error admin-mb-16">{state.error}</div>
      )}
      {state?.success && (
        <div className="admin-alert admin-alert-success admin-mb-16">Password updated successfully.</div>
      )}

      <div className="admin-form-group">
        <label className="admin-label admin-label-required">Current password</label>
        <input className="admin-input" type="password" name="currentPassword" required autoComplete="current-password" />
      </div>

      <div className="admin-form-group">
        <label className="admin-label admin-label-required">New password</label>
        <input className="admin-input" type="password" name="newPassword" required autoComplete="new-password" />
        <p className="admin-field-hint">Min 12 chars, must include uppercase, lowercase, number, and special character.</p>
      </div>

      <div className="admin-form-group">
        <label className="admin-label admin-label-required">Confirm new password</label>
        <input className="admin-input" type="password" name="confirmPassword" required autoComplete="new-password" />
      </div>

      <SubmitButton />
    </form>
  )
}
