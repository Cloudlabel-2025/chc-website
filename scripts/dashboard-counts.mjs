import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const [pages, media, submissions, sections, blocks, forms, templates, users] = await Promise.all([
  prisma.page.count(),
  prisma.mediaAsset.count(),
  prisma.formSubmission.count({ where: { isRead: false } }),
  prisma.section.count(),
  prisma.contentBlock.count(),
  prisma.formDefinition.count(),
  prisma.pageTemplate.count(),
  prisma.user.count(),
])
console.log(JSON.stringify({ pages, media, submissions, sections, blocks, forms, templates, users }))
await prisma.$disconnect()
