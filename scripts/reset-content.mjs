import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
const p=new PrismaClient()
console.log('Resetting Pages/Sections/Blocks/Seo...')
await p.contentBlock.deleteMany({where:{parentId:{not:null}}})
await p.contentBlock.deleteMany({})
await p.section.deleteMany({})
await p.seoMeta.deleteMany({})
await p.page.deleteMany({})
console.log('done')
await p.$disconnect()
