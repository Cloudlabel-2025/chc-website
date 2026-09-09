import { AsyncLocalStorage } from 'node:async_hooks'

// Isolate section instances during server rendering. Never use a shared mutable
// override: different pages and duplicate templates can render concurrently.
const sectionContext = new AsyncLocalStorage()
export function withSectionContext(section, sourceKey, siblings, render) {
  return sectionContext.run({ section, sourceKey, siblings }, render)
}
export function sectionBlocks(sectionKey) {
  const context = sectionContext.getStore()
  if (!context) return null
  const section = sectionKey === context.sourceKey
    ? context.section
    : context.siblings.find((item) => item.sectionKey === sectionKey && item.isVisible !== false)
  return section?.blocks ?? []
}
