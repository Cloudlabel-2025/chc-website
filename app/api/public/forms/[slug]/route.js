import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { buildDynamicFormSchema } from '@/lib/cms/schemas'
import { recordSubmission } from '@/lib/cms/forms'
import { formRateLimit } from '@/lib/cms/form-rate-limit'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  const slug = params.slug?.toLowerCase()
  const def = await prisma.formDefinition.findUnique({ where: { slug } })
  if (!def) return NextResponse.json({ error: 'Form not found.' }, { status: 404 })
  // Public GET only exposes active forms and strips internal fields
  if (!def.isActive) return NextResponse.json({ error: 'Form not available.' }, { status: 404 })
  return NextResponse.json({ form: { slug: def.slug, title: def.title, fields: def.fields, buttonText: def.buttonText, successMessage: def.successMessage, isActive: true } })
}

export async function POST(request, { params }) {
  const slug = params.slug?.toLowerCase()
  if (!slug) return NextResponse.json({ error: 'Missing form slug.' }, { status: 400 })

  const def = await prisma.formDefinition.findUnique({ where: { slug } })
  if (!def) return NextResponse.json({ error: 'Form not found.' }, { status: 404 })
  if (!def.isActive) return NextResponse.json({ error: 'This form is currently unavailable.' }, { status: 403 })

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const rl = await formRateLimit(ip)
  if (!rl.allowed) return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const schema = buildDynamicFormSchema(def.fields ?? [])
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const fieldErrors = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path?.[0] ?? '_general'
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message]
    }
    return NextResponse.json({ errors: parsed.error.issues.map((e) => e.message), fieldErrors }, { status: 422 })
  }

  const knownEnum = ['CONTACT', 'GIVE_ONE_HOUR']
  const normalized = def.slug.toUpperCase().replace(/-/g, '_')
  const formType = knownEnum.includes(normalized) ? normalized : 'CUSTOM'
  try {
    await recordSubmission({ formType, data: parsed.data, ipAddress: ip, formDefinitionId: def.id })
  } catch (err) {
    console.error('Dynamic form submission error:', err)
    return NextResponse.json({ error: 'Failed to save submission.' }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: def.successMessage || 'Submitted successfully.' }, { status: 201 })
}
