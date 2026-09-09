import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import assert from 'node:assert/strict'
const require = createRequire(import.meta.url)
require('@next/env').loadEnvConfig(process.cwd())
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({ log: [] })
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3137'], { windowsHide: true, stdio: 'ignore' })
try {
  let ready = false
  for (let i = 0; i < 40; i++) {
    try { await fetch('http://127.0.0.1:3137/api/auth/providers'); ready = true; break } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  assert.ok(ready, 'Verification server must start')
  const pages = await prisma.page.findMany({ where: { isPublished: true }, select: { slug: true, sections: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }], select: { id: true, isVisible: true } } } })
  for (const page of pages) {
    if (process.argv.includes('--volunteer-form') && page.slug !== 'give-one-hour') continue
    const response = await fetch(`http://127.0.0.1:3137/${page.slug === 'home' ? '' : page.slug}`)
    assert.equal(response.status, 200, `HTTP status for ${page.slug}`)
    const html = await response.text()
    if (page.slug === 'give-one-hour' && process.argv.includes('--volunteer-form')) {
      for (const name of ['full_name', 'linkedin', 'organisation', 'how_to_help', 'availability']) {
        assert.ok(html.includes(`name="${name}"`), `Volunteer form field ${name} must render`)
      }
      assert.equal([...html.matchAll(/name="full_name"/g)].length, 1, 'Volunteer form must render once')
      console.log('give-one-hour: volunteer form fields verified')
    }
    if (process.argv[2] === page.slug && process.argv[3]) {
      assert.ok(html.includes(`>${process.argv[3]}</h2>`), 'Saved section heading must appear in the rendered heading')
      console.log(`${page.slug}: saved heading verified`)
    }
    const rendered = [...html.matchAll(/data-cms-section="([^"]+)"/g)].map((match) => match[1])
    assert.deepEqual(rendered, page.sections.filter((s) => s.isVisible).map((s) => s.id), `Visible section order for ${page.slug}`)
    console.log(`${page.slug}: ${rendered.length} sections in saved order`)
  }
} finally {
  server.kill()
  await prisma.$disconnect()
}
