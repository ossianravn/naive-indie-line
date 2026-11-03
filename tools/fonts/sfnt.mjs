// Add a table to a finished OpenType file: rewrite the table directory in tag order, align each table to four bytes,
// recompute every checksum and the head table's checkSumAdjustment, as the OpenType spec asks.

const u32 = (view, at) => view.getUint32(at)
const pad4 = (n) => (n + 3) & ~3

function checksum(bytes) {
  const padded = new Uint8Array(pad4(bytes.length))
  padded.set(bytes)
  const view = new DataView(padded.buffer)
  let sum = 0
  for (let i = 0; i < padded.length; i += 4)
    sum = (sum + view.getUint32(i)) >>> 0
  return sum
}

export function addTable(font, tag, data) {
  const view = new DataView(font.buffer, font.byteOffset, font.byteLength)
  const version = u32(view, 0)
  const count = view.getUint16(4)
  const tables = []
  for (let i = 0; i < count; i++) {
    const at = 12 + i * 16
    const name = String.fromCharCode(...font.subarray(at, at + 4))
    const offset = u32(view, at + 8)
    const length = u32(view, at + 12)
    if (name !== tag)
      tables.push({ name, bytes: font.slice(offset, offset + length) })
  }
  tables.push({ name: tag, bytes: data })
  tables.sort((a, b) => (a.name < b.name ? -1 : 1))
  const n = tables.length
  const directory = 12 + n * 16
  const size = directory + tables.reduce((t, x) => t + pad4(x.bytes.length), 0)
  const out = new Uint8Array(size)
  const ov = new DataView(out.buffer)
  const pow = 2 ** Math.floor(Math.log2(n))
  ov.setUint32(0, version)
  ov.setUint16(4, n)
  ov.setUint16(6, pow * 16)
  ov.setUint16(8, Math.log2(pow))
  ov.setUint16(10, n * 16 - pow * 16)
  let offset = directory
  let head = 0
  tables.forEach((t, i) => {
    if (t.name === "head") {
      head = offset
      t.bytes = t.bytes.slice()
      new DataView(t.bytes.buffer).setUint32(8, 0)
      // modified = created (opentype.js stamps the time of the build), so the same sources build the same bytes.
      t.bytes.copyWithin(28, 20, 28)
    }
    const at = 12 + i * 16
    out.set(
      [...t.name].map((c) => c.charCodeAt(0)),
      at,
    )
    ov.setUint32(at + 4, checksum(t.bytes))
    ov.setUint32(at + 8, offset)
    ov.setUint32(at + 12, t.bytes.length)
    out.set(t.bytes, offset)
    offset += pad4(t.bytes.length)
  })
  ov.setUint32(head + 8, (0xb1b0afba - checksum(out)) >>> 0)
  return out
}

/** A table's bytes, copied out of a finished OpenType file. */
export function getTable(font, tag) {
  const view = new DataView(font.buffer, font.byteOffset, font.byteLength)
  for (let i = 0; i < view.getUint16(4); i++) {
    const at = 12 + i * 16
    if (String.fromCharCode(...font.subarray(at, at + 4)) === tag)
      return font.slice(
        view.getUint32(at + 8),
        view.getUint32(at + 8) + view.getUint32(at + 12),
      )
  }
  throw new Error(`no ${tag} table`)
}
