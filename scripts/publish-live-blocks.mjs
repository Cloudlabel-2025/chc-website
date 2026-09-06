import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const r = await prisma.contentBlock.updateMany({
  where: { mediaAssetId: { not: null } },
  data: { isPublished: true },
})
console.log(`Published ${r.count} media-linked blocks`)
await prisma.$disconnect()
