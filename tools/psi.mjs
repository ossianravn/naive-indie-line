// PageSpeed Insights (mobile) for live pages: `npm run psi -- /baghuset /maaltid /`.
// Reads PSI_API_KEY from `.env` at the repo root (gitignored); the keyless API runs out of quota.
import { existsSync } from "node:fs"

if (existsSync(".env")) process.loadEnvFile(".env")
const key = process.env.PSI_API_KEY
if (!key) {
  console.error("Set PSI_API_KEY in .env at the repo root.")
  process.exit(1)
}

const origin = process.env.PSI_ORIGIN ?? "https://naiveindieline.com"
const paths = process.argv.slice(2)
const metrics = [
  ["first-contentful-paint", "FCP"],
  ["largest-contentful-paint", "LCP"],
  ["total-blocking-time", "TBT"],
  ["cumulative-layout-shift", "CLS"],
  ["speed-index", "SI"],
]

for (const path of paths.length ? paths : ["/"]) {
  const api = new URL(
    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
  )
  api.searchParams.set("url", new URL(path, origin).href)
  api.searchParams.set("strategy", "mobile")
  for (const c of ["performance", "accessibility", "best-practices", "seo"]) {
    api.searchParams.append("category", c)
  }
  api.searchParams.set("key", key)
  const res = await fetch(api)
  const body = await res.json()
  if (!res.ok) {
    console.log(
      `${path}  error ${res.status}: ${body.error?.message ?? "unknown"}`,
    )
    continue
  }
  const { categories, audits } = body.lighthouseResult
  const scores = Object.values(categories)
    .map((c) => `${c.title} ${Math.round(c.score * 100)}`)
    .join(", ")
  const values = metrics
    .map(([id, label]) => `${label} ${audits[id].displayValue}`)
    .join(", ")
  console.log(`${path}  ${scores}\n  ${values}`)
}
