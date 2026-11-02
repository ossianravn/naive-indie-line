// The registry install contract: Fineliner items install into a fresh Vite + React + TypeScript app (./fixture)
// through the real shadcn CLI, arrive byte-identical to the kit's source, and the app then type-checks and builds.
// Ported from Patina UI's install test.
//
// It runs offline. The registry is built into a temporary folder and served on a local port, npm installs from the
// cache the repository's own install filled, and every other request goes to that server as a proxy, which refuses
// it. The fixture's components.json leaves tailwind.baseColor empty for this reason: with a base color, shadcn add
// downloads ui.shadcn.com/r/colors/<color>.json, which Fineliner's files do not use.
//
//   npm run test:consumer
import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import fs from "node:fs"
import http from "node:http"
import os from "node:os"
import path from "node:path"
import { test } from "node:test"
import { fileURLToPath } from "node:url"

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const fixture = path.join(repo, "tests/consumer/fixture")
const source = path.join(repo, "src/fineliner")
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

// The environment for every command. Settings an outer `npm run` exports (npm_config_prefix, npm_package_*) would
// point npm at this repository, and inherited proxy settings would override the guard, so neither is passed on.
const offline = (origin) => ({
  ...Object.fromEntries(
    Object.entries(process.env).filter(([key]) => !/^npm_|_proxy$/iu.test(key)),
  ),
  npm_config_offline: "true",
  npm_config_audit: "false",
  npm_config_fund: "false",
  HTTP_PROXY: origin,
  HTTPS_PROXY: origin,
  NO_PROXY: "127.0.0.1",
})

// Runs npm through the shell (it is a script on Windows) and anything else as a JavaScript file with this Node: the
// CLI under npx makes npm refuse the CLI's own dependency install (EALLOWSCRIPTS), as Patina's architecture records.
function run(env, cwd, command, ...args) {
  const npm = command === "npm"
  const local = path.relative(cwd, command)
  const label = `${npm ? "npm" : local.startsWith("..") ? command : local} ${args.join(" ")}`
  return new Promise((resolve, reject) => {
    const child = npm
      ? spawn(`npm ${args.join(" ")}`, [], { cwd, env, shell: true })
      : spawn(process.execPath, [command, ...args], { cwd, env })
    let output = ""
    child.stdout.on("data", (chunk) => (output += chunk))
    child.stderr.on("data", (chunk) => (output += chunk))
    child.on("error", reject)
    child.on("close", (code) =>
      code === 0
        ? resolve(output)
        : reject(
            new Error(`${label} exited with ${code}:\n${output.slice(-8000)}`),
          ),
    )
  })
}

// A static file server for the built registry, and the proxy that refuses everything else: a proxied request carries
// an absolute URL and gets a 404, and an HTTPS tunnel (CONNECT) gets a 403. Asynchronous child processes keep it
// answering while the CLI runs.
function serve(dir) {
  const server = http.createServer((request, response) => {
    const file = request.url.startsWith("/")
      ? path.join(
          dir,
          decodeURIComponent(new URL(request.url, "http://x").pathname),
        )
      : ""
    const found =
      file.startsWith(dir + path.sep) &&
      fs.statSync(file, { throwIfNoEntry: false })?.isFile()
    response.writeHead(found ? 200 : 404, {
      "content-type": "application/json",
    })
    response.end(found ? fs.readFileSync(file) : '{"error":"not found"}')
  })
  server.on("connect", (request, socket) =>
    socket.end(`HTTP/1.1 403 Offline test refused ${request.url}\r\n\r\n`),
  )
  return new Promise((resolve, reject) => {
    server.once("error", reject)
    server.listen(0, "127.0.0.1", () => resolve(server))
  })
}

const filesUnder = (dir) =>
  fs
    .readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) =>
      path
        .relative(dir, path.join(entry.parentPath, entry.name))
        .replaceAll("\\", "/"),
    )
    .sort()

// Shows the first line where an installed file departs from its source, or says the source does not exist.
function difference(name, installed, source) {
  if (!fs.existsSync(source)) return `${name}: no such file in the kit`
  const [a, b] = [source, installed].map((f) => fs.readFileSync(f))
  if (a.equals(b)) return undefined
  const [want, got] = [a, b].map((buffer) =>
    buffer.toString("utf8").split("\n"),
  )
  const at = want.findIndex((text, i) => text !== got[i])
  const line = at === -1 ? want.length : at
  const show = (text) => text?.replaceAll("\r", "\\r") ?? "(end of file)"
  return `${name}, line ${line + 1}\n    kit:       ${show(want[line])}\n    installed: ${show(got[line])}`
}

test(
  "registry items install into a fresh Vite app that type-checks and builds",
  { timeout: 15 * 60_000 },
  async (t) => {
    const scratch = fs.mkdtempSync(
      path.join(os.tmpdir(), "fineliner-consumer-"),
    )
    const registry = path.join(scratch, "registry")
    const app = path.join(scratch, "app")
    const server = await serve(registry)
    t.after(() => {
      server.close()
      fs.rmSync(scratch, { recursive: true, force: true, maxRetries: 5 })
    })
    const origin = `http://127.0.0.1:${server.address().port}`
    const env = offline(origin)
    const builder = path.join(repo, "tools/registry/build.mjs")

    await run(env, repo, builder, "--out", registry, "--base", `${origin}/r`)
    fs.cpSync(fixture, app, { recursive: true })
    await run(env, app, "npm", "install")
    const urls = items.map((name) => `${origin}/r/${name}.json`)
    await run(env, app, shadcn, "add", ...urls, "-y")

    // shadcn add rewrites imports as it writes files; any change here means a kit import resolves differently in
    // the consumer than in the repository.
    const kit = path.join(app, "src/fineliner")
    const installed = filesUnder(kit)
    assert.ok(
      installed.length > 0,
      "shadcn add wrote nothing under src/fineliner",
    )
    const changed = installed
      .map((file) =>
        difference(
          `src/fineliner/${file}`,
          path.join(kit, file),
          path.join(source, file),
        ),
      )
      .filter(Boolean)
    assert.ok(
      changed.length === 0,
      `installed kit files differ from the source:\n${changed.join("\n")}`,
    )

    const bin = (file) => path.join(app, "node_modules", file)
    await run(env, app, bin("typescript/bin/tsc"), "-b")
    await run(env, app, bin("vite/bin/vite.js"), "build")
    assert.ok(
      fs.existsSync(path.join(app, "dist/index.html")),
      "vite build wrote no dist/index.html",
    )
  },
)
