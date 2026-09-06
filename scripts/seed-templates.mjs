import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { SECTION_TEMPLATES } from '../lib/cms/section-templates.js'

const prisma = new PrismaClient()

for (const tpl of SECTION_TEMPLATES) {
  await prisma.pageTemplate.upsert({
    where: { name: tpl.name },
    update: {
      description: tpl.description ?? null,
      content: { key: tpl.key, category: tpl.category, sections: [{ sectionKey: tpl.key, blocks: tpl.defaultBlocks ?? [] }] },
    },
    create: {
      name: tpl.name,
      description: tpl.description ?? null,
      content: { key: tpl.key, category: tpl.category, sections: [{ sectionKey: tpl.key, blocks: tpl.defaultBlocks ?? [] }] },
    },
  })
  console.log(`Upserted template: ${tpl.name}`)
}
console.log('Done seeding templates')
await prisma.$disconnect()
