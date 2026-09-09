// Legacy/concurrent saves can leave more than one row for a field. Resolve
// fields by last save, while preserving every repeatable card/slide parent.
export function resolveContentBlocks(blocks = []) {
  const parents = new Set(blocks.map((block) => block.parentId).filter(Boolean))
  const fields = new Map()
  for (const block of blocks) {
    const key = parents.has(block.id) || (!block.parentId && (block.fieldKey === 'item' || block.fieldKey?.startsWith('template:')))
      ? `item:${block.id}`
      : JSON.stringify([block.sectionId ?? '', block.parentId ?? null, block.fieldKey])
    const previous = fields.get(key)
    const saved = (value) => new Date(value.updatedAt ?? value.createdAt ?? 0).getTime()
    if (!previous || saved(block) > saved(previous) || (saved(block) === saved(previous) && String(block.id) >= String(previous.id))) {
      fields.set(key, block)
    }
  }
  return [...fields.values()]
}
