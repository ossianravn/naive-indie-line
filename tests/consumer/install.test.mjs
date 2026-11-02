// The registry install contract: Fineliner items install through the real shadcn CLI into two fresh apps, arrive
// byte-identical to the kit's source, and each app then type-checks and builds.
//   ./fixture       Vite + React + TypeScript (ported from Patina UI's install test)
//   ./fixture-next  Next.js App Router with rsc: true. Its page is a server component that imports the kit's parts
//                   directly, so a kit file that uses hooks or browser APIs without "use client" fails next build,
//                   which Vite cannot catch.
//
// It runs offline. The registry is built into a temporary folder and served on a local port, npm installs from the
// cache the repository's own install filled, and every other request goes to that server as a proxy, which refuses
// it. The fixtures' components.json leave tailwind.baseColor empty for this reason: with a base color, shadcn add
// downloads ui.shadcn.com/r/colors/<color>.json, which Fineliner's files do not use.
//
// Next.js is not one of the repository's dependencies, so the cache needs it and its dependencies (including the
// SWC binary for this platform) added once, online. From an empty folder outside the repository:
//   npm install --no-save next@16.4.4 @tailwindcss/postcss@4.3.3
// (npm cache add next@16.4.4 alone adds only next's own tarball, not its dependencies.)
//
//   npm run test:consumer
import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { test } from "node:test"
import {
  assertKitMatchesSource,
  offline,
  repo,
  run,
  serve,
} from "./helpers.mjs"

const shadcn = path.join(repo, "node_modules/shadcn/dist/index.js")

// The items whose parts fixture/src/App.tsx imports. base and pen arrive as their item dependencies, which exercises
// the --base dependency URLs and fails the type-check if an item leaves out one it imports. Not the fineliner
// umbrella: it lists every item, so it would hide a missing dependency.
// dialog brings button, field brings label and separator, toggle-group brings toggle, avatar brings drawing, and
// chart brings recharts and the pen's plotting module; record-sleeve is an extra and sign-in-01 a block, which
// installs with its own item dependencies.
const items = [
  "drawing",
  "dialog",
  "field",
  "input",
  "select",
  "toggle-group",
  "avatar",
  "table",
  "chart",
  "record-sleeve",
  "sign-in-01",
]

// Builds and serves the registry, copies the fixture into a temporary app, installs it offline, adds the items and
// checks the installed kit against the source. Returns the app folder and the environment for its build commands.
async function install(t, fixture, extraEnv = {}) {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "fineliner-consumer-"))
  const registry = path.join(scratch, "registry")
  const app = path.join(scratch, "app")
  const server = await serve(registry)
  t.after(() => {
    server.close()
    fs.rmSync(scratch, { recursive: true, force: true, maxRetries: 5 })
  })
  const origin = `http://127.0.0.1:${server.address().port}`
  const env = { ...offline(origin), ...extraEnv }
  const builder = path.join(repo, "tools/registry/build.mjs")

  await run(env, repo, builder, "--out", registry, "--base", `${origin}/r`)
  fs.cpSync(path.join(repo, "tests/consumer", fixture), app, {
    recursive: true,
  })
  await run(env, app, "npm", "install")
  const urls = items.map((name) => `${origin}/r/${name}.json`)
  await run(env, app, shadcn, "add", ...urls, "-y")
  assertKitMatchesSource(app)
  return { app, env, bin: (file) => path.join(app, "node_modules", file) }
}

test(
  "registry items install into a fresh Vite app that type-checks and builds",
  { timeout: 15 * 60_000 },
  async (t) => {
    const { app, env, bin } = await install(t, "fixture")
    await run(env, app, bin("typescript/bin/tsc"), "-b")
    await run(env, app, bin("vite/bin/vite.js"), "build")
    assert.ok(
      fs.existsSync(path.join(app, "dist/index.html")),
      "vite build wrote no dist/index.html",
    )
  },
)

test(
  "registry items install into a fresh Next.js app whose server page builds",
  { timeout: 15 * 60_000 },
  async (t) => {
    const { app, env, bin } = await install(t, "fixture-next", {
      NEXT_TELEMETRY_DISABLED: "1",
    })
    // next build type-checks the app (and writes next-env.d.ts) before it bundles the server and client graphs.
    await run(env, app, bin("next/dist/bin/next"), "build")
    assert.ok(
      fs.existsSync(path.join(app, ".next/BUILD_ID")),
      "next build wrote no .next/BUILD_ID",
    )
  },
)
