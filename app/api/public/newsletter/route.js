import { NextResponse } from 'next/server'
import { newsletterSchema } from '@/lib/cms/schemas'
import { recordSubmission } from '@/lib/cms/forms'
import { formRateLimit } from '@/lib/cms/form-rate-limit'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  const rl = await formRateLimit(ip)
  if (rl.limited) return NextResponse.json({ error: rl.message }, { status: 429 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const parsed = newsletterSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.errors.map((e) => e.message) },
      { status: 422 }
    )
  }

  try {
    await recordSubmission({ formType: 'NEWSLETTER', data: parsed.data, ipAddress: ip })
  } catch (err) {
    console.error('Newsletter record error:', err)
    return NextResponse.json({ error: 'Failed to save subscription.' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
