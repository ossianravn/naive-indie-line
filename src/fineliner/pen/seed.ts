// Every random choice in Fineliner comes from a seed, so the same seed draws the same thing on the server, in the
// browser and in every build. Patina UI's seed functions, unchanged (Patina ported them from Mental Models).

/** FNV-1a over UTF-16 code units, reduced to 31 bits. */
export function seedOf(text: string | number): number {
  return (
    ([...String(text)].reduce(
      (h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619),
      2166136261,
    ) >>>
      0) %
    2 ** 31
  )
}

/** A small seeded PRNG (mulberry32 family) returning values in [0, 1). */
export function prng(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** A labelled sub-seed. Each kind of decision draws from its own fork, so adding a new one leaves the rest unchanged. */
export function fork(seed: number, label: string): number {
  return seedOf(`${seed}:${label}`)
}

/** A PRNG with a helper for ranges, drawn from a labelled fork. */
export function stream(seed: number, label: string) {
  const next = prng(fork(seed, label))
  return {
    next,
    between: (a: number, b: number) => a + next() * (b - a),
    /** A signed unit value in [-1, 1). */
    signed: () => next() * 2 - 1,
    pick: <T>(items: readonly T[]): T =>
      items[Math.floor(next() * items.length)] as T,
    /** True with probability p. */
    chance: (p: number) => next() < p,
  }
}

export type Stream = ReturnType<typeof stream>
