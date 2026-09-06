import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const MAP = {
  'home:whatWeDo:image': ['oracle-home-hcm.jpg','app-dev-home.jpg','pts-home.jpg'],
  'home:whyChc:image': ['sls-home.jpg','cost-effective.jpg','cap-dev.jpg','social-impact.jpg'],
  'oracle-hcm:capabilityItem:icon': ['core-hr-vec.png','wfs.png','compensation-vector.png','talent-vector.png','learning-vector.png','payroll-vector.png','security-aor-vector.png','approvals-vector.png','journey-vector.png','hcm-extracts-vector.png','integrations-vector.png','testing-vectot.png','qua-rel-vec.png','redwood-vec.png','technical-remediation-vec.png'],
  'oracle-hcm:productisedService:image': ['healthcheck.jpg','rapid-response.jpg','release-assurance.jpg','oracle-tech-pod.jpg'],
  'oracle-hcm:serviceCarouselItem:image': ['config.png','testing.jpg','reporting.jpg','data.jpg','integration.jpg','vbcs.jpg','support.jpg','manage-support.jpg'],
}

async function main(){
  console.log('Linking MediaAsset → ContentBlock\n')
  // build filename -> mediaAssetId map
  const assets = await prisma.mediaAsset.findMany()
  const byFile = new Map(assets.map(a=>[a.filename, a.id]))
  let linked=0, missing=0
  for(const key of Object.keys(MAP)){
    const [pageSlug, sectionKey, fieldKey] = key.split(':')
    const files = MAP[key]
    const page = await prisma.page.findUnique({where:{slug:pageSlug}})
    if(!page){ console.log(`  ⚠ no page ${pageSlug}`); continue}
    const section = await prisma.section.findFirst({where:{pageId:page.id, sectionKey}})
    if(!section){ console.log(`  ⚠ no section ${sectionKey} on ${pageSlug}`); continue}
    const all = await prisma.contentBlock.findMany({where:{sectionId:section.id}, orderBy:{sortOrder:'asc'}})
    const parents = all.filter(b=>!b.parentId)
    console.log(`  ${pageSlug}/${sectionKey} total=${all.length} parents=${parents.length} field=${fieldKey}`)
    for(let i=0;i<parents.length;i++){
      const parent = parents[i]
      const file = files[i % files.length]
      const assetId = byFile.get(file)
      if(!assetId){ console.log(`  ⚠ no MediaAsset for ${file}`); missing++; continue}
      const allChildren = all.filter(b=>b.parentId===parent.id)
      const child = allChildren.find(c=>c.fieldKey===fieldKey)
      if(!child){
        // create missing IMAGE block
        await prisma.contentBlock.create({data:{sectionId:section.id, parentId:parent.id, fieldKey, blockType:'IMAGE', mediaAssetId:assetId, sortOrder:0, isPublished:true, createdById: parent.createdById, updatedById: parent.createdById}})
        console.log(`  + created ${pageSlug}/${sectionKey}[${i}] ${fieldKey} → ${file}`)
        linked++
      } else if(!child.mediaAssetId){
        await prisma.contentBlock.update({where:{id:child.id}, data:{mediaAssetId:assetId, blockType:'IMAGE'}})
        console.log(`  ✓ linked ${pageSlug}/${sectionKey}[${i}] ${fieldKey} → ${file}`)
        linked++
      } else {
        // already linked
      }
    }
  }
  console.log(`\n✅ linked ${linked}, missing ${missing}`)
}
main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect())
