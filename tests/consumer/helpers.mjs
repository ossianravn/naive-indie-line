// Helpers for the registry install contract (install.test.mjs): the offline environment, the registry server and
// proxy, child processes, and the check that installed kit files match the source.
import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import fs from "node:fs"
import http from "node:http"
import path from "node:path"
import { fileURLToPath } from "node:url"

export const repo = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
)
const source = path.join(repo, "src/fineliner")

// The environment for every command. Settings an outer `npm run` exports (npm_config_prefix, npm_package_*) would
// point npm at this repository, and inherited proxy settings would override the guard, so neither is passed on.
export const offline = (origin) => ({
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
export function run(env, cwd, command, ...args) {
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
export function serve(dir) {
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

// shadcn add rewrites imports as it writes files; any change here means a kit import resolves differently in the
// consumer than in the repository.
export function assertKitMatchesSource(app) {
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
}
