/**
 * CHC CMS — Image Dimension Reader
 *
 * Reads width/height from image file headers without a heavy dependency.
 * Supports JPEG, PNG, WebP. Returns null for SVG (vector, no fixed dimensions).
 *
 * @param {Buffer} buffer
 * @param {string} mimeType
 * @returns {{ width: number, height: number } | null}
 */
export function readImageDimensions(buffer, mimeType) {
  try {
    if (mimeType === 'image/png')  return readPng(buffer)
    if (mimeType === 'image/jpeg') return readJpeg(buffer)
    if (mimeType === 'image/webp') return readWebp(buffer)
    return null // SVG and others — no fixed dimensions
  } catch {
    return null
  }
}

// PNG: width at bytes 16–19, height at bytes 20–23 (after 8-byte sig + 8-byte IHDR header)
function readPng(buf) {
  if (buf.length < 24) return null
  // Check PNG signature
  if (buf[0] !== 0x89 || buf[1] !== 0x50) return null
  const width  = buf.readUInt32BE(16)
  const height = buf.readUInt32BE(20)
  return { width, height }
}

// JPEG: scan for SOF markers (0xFFC0, 0xFFC2) which contain dimensions
function readJpeg(buf) {
  if (buf.length < 4) return null
  if (buf[0] !== 0xFF || buf[1] !== 0xD8) return null

  let offset = 2
  while (offset < buf.length - 8) {
    if (buf[offset] !== 0xFF) break
    const marker = buf[offset + 1]
    const length = buf.readUInt16BE(offset + 2)

    // SOF0 (0xC0) or SOF2 (0xC2) — baseline/progressive DCT
    if (marker === 0xC0 || marker === 0xC2) {
      const height = buf.readUInt16BE(offset + 5)
      const width  = buf.readUInt16BE(offset + 7)
      return { width, height }
    }

    offset += 2 + length
  }
  return null
}

// WebP: check RIFF header, then VP8/VP8L/VP8X chunk for dimensions
function readWebp(buf) {
  if (buf.length < 30) return null
  // RIFF....WEBP
  if (buf.toString('ascii', 0, 4) !== 'RIFF') return null
  if (buf.toString('ascii', 8, 12) !== 'WEBP') return null

  const chunkType = buf.toString('ascii', 12, 16)

  if (chunkType === 'VP8 ') {
    // Lossy: width/height at bytes 26–29 (14-bit values, little-endian, mask 0x3FFF)
    if (buf.length < 30) return null
    const width  = (buf.readUInt16LE(26) & 0x3FFF) + 1
    const height = (buf.readUInt16LE(28) & 0x3FFF) + 1
    return { width, height }
  }

  if (chunkType === 'VP8L') {
    // Lossless: packed bits at byte 21
    if (buf.length < 25) return null
    const bits = buf.readUInt32LE(21)
    const width  = (bits & 0x3FFF) + 1
    const height = ((bits >> 14) & 0x3FFF) + 1
    return { width, height }
  }

  if (chunkType === 'VP8X') {
    // Extended: 24-bit width/height at bytes 24–29
    if (buf.length < 30) return null
    const width  = (buf[24] | (buf[25] << 8) | (buf[26] << 16)) + 1
    const height = (buf[27] | (buf[28] << 8) | (buf[29] << 16)) + 1
    return { width, height }
  }

  return null
}
