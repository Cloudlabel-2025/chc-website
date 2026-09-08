import { NextResponse } from 'next/server'
import { giveOneHourSchema } from '@/lib/cms/schemas'
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

  const parsed = giveOneHourSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        errors: parsed.error.errors.map((e) => e.message),
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    )
  }

  try {
    await recordSubmission({ formType: 'GIVE_ONE_HOUR', data: parsed.data, ipAddress: ip })
  } catch (err) {
    console.error('Give one hour record error:', err)
    return NextResponse.json({ error: 'Failed to save submission.' }, { status: 500 })
  }

  if (process.env.SMTP_HOST && process.env.CONTACT_EMAIL_TO) {
    try {
      const nodemailer = await import('nodemailer')
      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT ?? '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })
      await transporter.sendMail({
        from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
        to: process.env.CONTACT_EMAIL_TO,
        subject: `CHC Give One Hour: ${parsed.data.full_name}`,
        text: Object.entries(parsed.data)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n'),
      })
    } catch (err) {
      console.error('Give one hour email error:', err)
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Thank you for your interest. We will be in touch shortly.',
  }, { status: 201 })
}
