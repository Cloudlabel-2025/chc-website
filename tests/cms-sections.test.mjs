import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
const load = async (path) => import(`data:text/javascript;base64,${Buffer.from(readFileSync(path, 'utf8')).toString('base64')}`)
const { orderVisibleSections, findSectionView } = await load('lib/cms/section-layout.js')
const { withSectionContext, sectionBlocks } = await load('lib/cms/section-context.js')

test('saved order can place a new section above the hero and hides disabled sections', () => {
  const sections = [{ id: 'hero', sortOrder: 2 }, { id: 'new', sortOrder: 0 }, { id: 'hidden', sortOrder: 1, isVisible: false }]
  assert.deepEqual(orderVisibleSections(sections).map((s) => s.id), ['new', 'hero'])
  assert.equal(sections[0].id, 'hero')
})
test('duplicate templates render their own data even across concurrent pages', async () => {
  const a = { blocks: [{ textValue: 'First carousel' }] }
  const b = { blocks: [{ textValue: 'Second carousel' }] }
  const values = await Promise.all([a, b].map((section) => withSectionContext(section, 'serviceSlide', [], async () => {
    await new Promise((resolve) => setTimeout(resolve, 5))
    return sectionBlocks('serviceSlide')[0].textValue
  })))
  assert.deepEqual(values, ['First carousel', 'Second carousel'])
  assert.equal(sectionBlocks('serviceSlide'), null)
})
test('authored view extraction preserves the original element and its component properties', () => {
  const view = { type: 'section', props: { 'data-cms-template': 'serviceSlide', className: 'carousel', children: { type: 'InteractiveCarousel', props: { slides: [1, 2] } } } }
  assert.equal(findSectionView({ props: { children: [false, view] } }, 'serviceSlide'), view)
  assert.equal(findSectionView(view, 'hero'), null)
})
