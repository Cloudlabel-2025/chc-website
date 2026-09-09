import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
const source = readFileSync('lib/cms/content-blocks.js', 'utf8')
const { resolveContentBlocks } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
test('most recently saved heading wins regardless of database row order', () => {
  const old = { id: '1', sectionId: 'section', parentId: null, fieldKey: 'sectionHeading', textValue: 'Our capabilities', updatedAt: '2026-09-08' }
  const saved = { ...old, id: '2', textValue: 'Ways to Contribute', updatedAt: '2026-09-09' }
  for (const rows of [[old, saved], [saved, old]]) assert.equal(resolveContentBlocks(rows)[0].textValue, 'Ways to Contribute')
  assert.equal(resolveContentBlocks([old, { ...saved, textValue: '' }])[0].textValue, '')
})
test('duplicate field resolution preserves distinct slides and section instances', () => {
  const rows = [
    { id: 'a', sectionId: 's1', fieldKey: 'item' },
    { id: 'b', sectionId: 's1', fieldKey: 'item' },
    { id: 'c', sectionId: 's1', parentId: 'a', fieldKey: 'title' },
    { id: 'd', sectionId: 's1', parentId: 'b', fieldKey: 'title' },
    { id: 'e', sectionId: 's2', fieldKey: 'sectionHeading' },
    { id: 'f', sectionId: 's1', fieldKey: 'sectionHeading' },
  ]
  assert.equal(resolveContentBlocks(rows).length, 6)
})

test('saving a seeded heading matches missing or null parent fields and updates the existing row', async () => {
  const source = readFileSync('lib/cms/content.js', 'utf8')
  const start = source.indexOf('export async function upsertBlock(')
  const end = source.indexOf('/**', start)
  let where
  let updated
  const save = new Function('requireAdmin', 'prisma', 'writeAudit', `${source.slice(start, end).replace('export ', '')}; return upsertBlock`)(
    async () => ({ user: { id: 'admin' } }),
    { contentBlock: {
      findFirst: async (query) => { where = query.where; return { id: 'existing' } },
      update: async (query) => { updated = query; return { id: 'existing', ...query.data } },
      create: async () => assert.fail('Existing heading must not create another row'),
    } },
    async () => {},
  )
  await save({ sectionId: 'section', fieldKey: 'sectionHeading', blockType: 'TEXT', textValue: 'Ways to Contribute' })
  assert.deepEqual(where.OR, [{ parentId: null }, { parentId: { isSet: false } }])
  assert.equal(updated.where.id, 'existing')
  assert.equal(updated.data.textValue, 'Ways to Contribute')
})
