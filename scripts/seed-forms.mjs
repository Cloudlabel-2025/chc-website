import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const forms = [
  {
    slug: 'contact',
    title: 'Contact',
    fields: [
      { key: 'name', type: 'text', label: 'Name', placeholder: 'Your name', required: true, maxLength: 100 },
      { key: 'email', type: 'email', label: 'Email', placeholder: 'Your email', required: true, maxLength: 254 },
      { key: 'phone', type: 'tel', label: 'Phone', placeholder: 'Your phone', required: false, maxLength: 30 },
      { key: 'subject', type: 'text', label: 'Subject', placeholder: 'Subject', required: false, maxLength: 150 },
      { key: 'comment', type: 'textarea', label: 'Message', placeholder: 'Your message', required: false, maxLength: 2000 },
    ],
    buttonText: 'Send message',
    successMessage: 'Message sent — we\'ll be in touch.',
  },
  {
    slug: 'give-one-hour',
    title: 'Give One Hour',
    fields: [
      { key: 'full_name', type: 'text', label: 'Full name', placeholder: 'Your full name', required: true, maxLength: 100 },
      { key: 'linkedin', type: 'url', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...', required: true, maxLength: 300 },
      { key: 'organisation', type: 'text', label: 'Organisation', placeholder: 'Your organisation', required: true, maxLength: 150 },
      { key: 'role', type: 'text', label: 'Role', placeholder: 'Your role', required: true, maxLength: 100 },
      { key: 'expertise', type: 'text', label: 'Area of expertise', placeholder: 'e.g. Oracle HCM', required: true, maxLength: 200 },
      { key: 'how_to_help', type: 'textarea', label: 'How would you like to help?', placeholder: 'Tell us how you\'d like to help', required: true, minLength: 10, maxLength: 2000 },
      { key: 'availability', type: 'text', label: 'Availability', placeholder: 'e.g. Weekends', required: true, maxLength: 150 },
      { key: 'format', type: 'select', label: 'Format', required: true, options: ['online', 'in_person', 'both'] },
      { key: 'anything_else', type: 'textarea', label: 'Anything else', placeholder: 'Anything you\'d like us to know?', required: false, maxLength: 2000 },
    ],
    buttonText: 'Give My One Hour',
    successMessage: 'Thank you — we\'ll be in touch.',
  },
  {
    slug: 'newsletter',
    title: 'Newsletter',
    fields: [
      { key: 'email', type: 'email', label: 'Email', placeholder: 'Enter your email...', required: true, maxLength: 254 },
    ],
    buttonText: 'Subscribe',
    successMessage: 'Subscribed — thank you!',
  },
]

const systemUser = await prisma.user.findFirst()
const userId = systemUser?.id ?? '000000000000000000000000'

for (const f of forms) {
  await prisma.formDefinition.upsert({
    where: { slug: f.slug },
    update: { title: f.title, fields: f.fields, buttonText: f.buttonText, successMessage: f.successMessage, isActive: true, updatedById: userId },
    create: { slug: f.slug, title: f.title, fields: f.fields, buttonText: f.buttonText, successMessage: f.successMessage, isActive: true, createdById: userId, updatedById: userId },
  })
  console.log(`Upserted form: ${f.slug}`)
}
console.log('Done seeding forms')
await prisma.$disconnect()
