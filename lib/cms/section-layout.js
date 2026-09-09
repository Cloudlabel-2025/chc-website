export function orderVisibleSections(sections) {
  return sections.filter((section) => section.isVisible !== false)
    .map((section, index) => ({ section, index }))
    .sort((a, b) => a.section.sortOrder - b.section.sortOrder || a.index - b.index)
    .map(({ section }) => section)
}

// Select the authored section element without mounting the rest of its page.
// This retains its component imports, classes, animations and responsive CSS.
export function findSectionView(node, key) {
  if (!node || typeof node !== 'object') return null
  if (Array.isArray(node)) {
    for (const child of node) {
      const match = findSectionView(child, key)
      if (match) return match
    }
    return null
  }
  if (node.props?.['data-cms-template'] === key) return node
  return findSectionView(node.props?.children, key)
}
