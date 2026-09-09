import assert from 'node:assert/strict'
import test from 'node:test'

const { validateContact, CONTACT_SUBJECTS } = await import('../lib/cms/form-validation.js')
const { buildDynamicFormSchema } = await import('../lib/cms/schemas.js')

const VALID = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '+44 20 1234 5678',
  subject: CONTACT_SUBJECTS[0],
  comment: 'Hello, I need some help.',
}

test('contact form accepts a valid submission', () => {
  assert.deepEqual(validateContact(VALID), {})
})

test('contact name only allows letters and spaces, max 100', () => {
  assert.ok(validateContact({ ...VALID, name: 'Jane123' }).name)
  assert.ok(validateContact({ ...VALID, name: '' }).name)
  assert.ok(validateContact({ ...VALID, name: 'Jane@Doe' }).name)
  const over = validateContact({ ...VALID, name: 'A'.repeat(101) }).name
  assert.match(over[0], /100/)
  assert.deepEqual(validateContact({ ...VALID, name: 'Jane  Doe' }), {})
})

test('contact email must be a valid address', () => {
  assert.ok(validateContact({ ...VALID, email: 'not-an-email' }).email)
  assert.ok(validateContact({ ...VALID, email: '' }).email)
  assert.deepEqual(validateContact({ ...VALID, email: 'jane+tag@example.co.uk' }), {})
})

test('contact phone only allows numbers, spaces, + and - up to 25 chars', () => {
  assert.ok(validateContact({ ...VALID, phone: 'abc123' }).phone)
  assert.ok(validateContact({ ...VALID, phone: '+44 20'.padEnd(28, '1') }).phone)
  assert.deepEqual(validateContact({ ...VALID, phone: '+44-20 1234 5678' }), {})
  assert.deepEqual(validateContact({ ...VALID, phone: '' }), {})
  assert.deepEqual(validateContact({ ...VALID, phone: '12345' }), {})
})

test('contact subject must be one of the allowed options', () => {
  assert.ok(validateContact({ ...VALID, subject: 'Random topic' }).subject)
  assert.ok(validateContact({ ...VALID, subject: '' }).subject)
  assert.deepEqual(validateContact({ ...VALID, subject: 'Other' }), {})
  for (const subject of CONTACT_SUBJECTS) {
    assert.deepEqual(validateContact({ ...VALID, subject }), {})
  }
})

test('contact message is optional but limited to 2000 chars', () => {
  assert.deepEqual(validateContact({ ...VALID, comment: '' }), {})
  assert.ok(validateContact({ ...VALID, comment: 'x'.repeat(2001) }).comment)
  assert.deepEqual(validateContact({ ...VALID, comment: 'Short message' }), {})
})

test('dynamic form schema applies default phone and custom pattern rules', () => {
  const schema = buildDynamicFormSchema([
    { key: 'phone', type: 'tel', label: 'Phone', required: true },
    { key: 'rating', type: 'text', label: 'Rating', required: true, pattern: '^[1-5]$', patternMessage: 'Rate between 1 and 5' },
    { key: 'email', type: 'email', label: 'Email', required: true },
    { key: 'note', type: 'text', label: 'Note', required: false },
  ])

  const ok = schema.safeParse({ phone: '+44 20 1234', rating: '3', email: 'a@b.co', note: '' })
  assert.equal(ok.success, true)

  const badPhone = schema.safeParse({ phone: 'abc', rating: '3', email: 'a@b.co', note: '' })
  assert.equal(badPhone.success, false)
  assert.match(badPhone.error.issues.map((i) => i.message).join(' '), /invalid phone/i)

  const badPattern = schema.safeParse({ phone: '+44', rating: '9', email: 'a@b.co', note: '' })
  assert.equal(badPattern.success, false)
  assert.deepEqual(
    badPattern.error.issues.filter((i) => i.path[0] === 'rating').map((i) => i.message),
    ['Rate between 1 and 5']
  )

  const missingEmail = schema.safeParse({ phone: '+44', rating: '3', email: '', note: '' })
  assert.equal(missingEmail.success, false)
  assert.ok(missingEmail.error.issues.some((i) => i.path[0] === 'email'))
})