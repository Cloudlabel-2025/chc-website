import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
const require = createRequire(import.meta.url)
const { transform } = require('next/dist/build/swc')
const { code } = await transform(readFileSync('components/SlideLink.jsx', 'utf8'), {
  filename: 'SlideLink.jsx',
  jsc: { parser: { syntax: 'ecmascript', jsx: true }, transform: { react: { runtime: 'automatic' } } },
  module: { type: 'commonjs' },
})
const compiled = { exports: {} }
new Function('require', 'module', 'exports', code)(require, compiled, compiled.exports)
const SlideLink = compiled.exports.default

test('empty CMS destinations render normal text without navigation or button styling', () => {
  for (const href of [undefined, null, '', '  ', '#']) {
    const element = SlideLink({ href, children: 'Contact us', className: 'btn btn-dark-gray text-white force-magic-cursor', onClick: () => assert.fail('must not navigate') })
    assert.equal(element.type, 'span')
    assert.equal(element.props.href, undefined)
    assert.equal(element.props.onClick, undefined)
    assert.equal(element.props.className, 'text-white')
    assert.equal(element.props.children, 'Contact us')
  }
})
test('explicit CMS links retain their URL and navigation behavior', () => {
  const click = () => {}
  for (const href of ['/', '/contact', '#details', 'https://example.com/contact']) {
    const element = SlideLink({ href, children: 'Open', onClick: click })
    assert.equal(element.type, 'a')
    assert.equal(element.props.href, href)
    assert.equal(element.props.onClick, click)
  }
})
