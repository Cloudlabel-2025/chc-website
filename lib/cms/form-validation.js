export const GIVE_ONE_HOUR_AVAILABILITY = ['Morning', 'Afternoon', 'Evening']

export const CONTACT_SUBJECTS = [
  'Oracle HCM requirement',
  'Oracle partner / subcontract delivery',
  'LIMS demo',
  'School application',
  'Technology support',
  'AI / advisory services',
  'Give One Hour',
  'Careers',
  'Other',
]

// Shared field patterns used by both client and server validation.
export const NAME_PATTERN = /^[A-Za-z ]+$/u
export const PHONE_PATTERN = /^[0-9+ -]*$/u

const NO_URL = /^(?!.*(?:https?:\/\/|www\.|[\w-]+\.(?:com|org|net|io)\b)).*$/i

export function validateGiveOneHour(values) {
  const errors = {}
  const required = {
    full_name: 'Full name is required', linkedin: 'LinkedIn profile URL is required',
    organisation: 'Organisation is required', role: 'Role is required',
    expertise: 'Area of expertise is required', how_to_help: 'Please tell us how you would like to help',
    availability: 'Please select your preferred availability', format: 'Please select a format',
  }
  for (const [key, message] of Object.entries(required)) if (!String(values[key] ?? '').trim()) errors[key] = [message]
  const textRules = [['full_name', 80, 'Full name'], ['organisation', 120, 'Organisation'], ['role', 80, 'Role'], ['expertise', 160, 'Area of expertise']]
  for (const [key, max, label] of textRules) {
    const value = String(values[key] ?? '')
    if (value.length > max) errors[key] = [`${label} must be ${max} characters or fewer`]
    if (value.includes('\n') || !NO_URL.test(value)) errors[key] = [`${label} must be plain text`]
  }
  const linkedin = String(values.linkedin ?? '')
  if (linkedin && (!/^https?:\/\/([\w-]+\.)?linkedin\.com\//i.test(linkedin) || linkedin.length > 300)) errors.linkedin = ['Enter a valid LinkedIn profile URL']
  const help = String(values.how_to_help ?? '')
  if (help && (help.trim().length < 10 || help.length > 1000)) errors.how_to_help = ['Please enter between 10 and 1000 characters']
  if (!GIVE_ONE_HOUR_AVAILABILITY.includes(values.availability)) errors.availability = ['Choose Morning, Afternoon, or Evening']
  if (!['online', 'in_person', 'both'].includes(values.format)) errors.format = ['Please select a format']
  if (String(values.anything_else ?? '').length > 1000) errors.anything_else = ['Please use 1000 characters or fewer']
  return errors
}

/**
 * Client-side validation for the contact form. Mirrors contactFormSchema in
 * schemas.js. Returns per-field error arrays, keyed by field name.
 *
 * @param {Record<string, string>} values
 * @returns {Record<string, string[]>}
 */
export function validateContact(values = {}) {
  const errors = {}

  const name = String(values.name ?? '').trim()
  if (!name) errors.name = ['Name is required']
  else if (name.length > 100) errors.name = ['Name must be 100 characters or fewer']
  else if (!NAME_PATTERN.test(name)) errors.name = ['Name can only contain letters and spaces']

  const email = String(values.email ?? '').trim()
  if (!email) errors.email = ['Email address is required']
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)) errors.email = ['Invalid email address']
  else if (email.length > 254) errors.email = ['Email must be 254 characters or fewer']

  const phone = String(values.phone ?? '').trim()
  if (phone && (phone.length > 25)) errors.phone = ['Phone must be 25 characters or fewer']
  else if (phone && !PHONE_PATTERN.test(phone)) errors.phone = ['Phone can only contain numbers, spaces, + or -']

  const subject = String(values.subject ?? '')
  if (!CONTACT_SUBJECTS.includes(subject)) errors.subject = ['Please select a subject']

  const comment = String(values.comment ?? '')
  if (comment.length > 2000) errors.comment = ['Message must be 2000 characters or fewer']

  return errors
}
