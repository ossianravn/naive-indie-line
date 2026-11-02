// Generates registry.json and public/r/*.json, the shadcn registry for Fineliner, from src/fineliner/. Every kit file
// installs to the same path under src/fineliner/ in the consumer, so the kit's own imports stay valid. Membership is
// in items.json; npm and item dependencies are read from each file's imports. Ported from Patina UI's builder.
//
//   node tools/registry/build.mjs                 write registry.json and run shadcn build into public/r
//   node tools/registry/build.mjs --check         fail if either is stale or a kit file cannot be placed
//   node tools/registry/build.mjs --base <url>    item dependencies as <url>/<name>.json (local install tests)
//   node tools/registry/build.mjs --out <dir>     write <dir>/registry.json and <dir>/r instead of the repo's copies
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const kit = "src/fineliner"
const alias = "@/fineliner/"
const { groups, descriptions, requires, peers, devDependencies } = JSON.parse(
  fs.readFileSync(path.join(root, "tools/registry/items.json"), "utf8"),
)
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8"),
)

// Provided by any React + Tailwind project.
const provided = new Set(["react", "react-dom", "tailwindcss"])

const walk = (dir) =>
  fs
    .readdirSync(path.join(root, dir), { withFileTypes: true })
    .flatMap((entry) => {
      const file = `${dir}/${entry.name}`
      if (entry.isDirectory()) return walk(file)
      return /\.(tsx?|css)$/u.test(entry.name) ? [file] : []
    })

const matches = (file, pattern) =>
  pattern.endsWith("/") ? file.startsWith(pattern) : file === pattern

// A block is blocks/<name>-<number>.tsx, as shadcn names them (login-01); its helpers, blocks/<block>-<part>.tsx,
// install with it.
const blockOf = (file) =>
  /^blocks\/([a-z0-9-]*?-\d+)(?:-[a-z0-9-]+)?\.tsx?$/u.exec(file)?.[1]

const groupOf = (file) =>
  Object.entries(groups).find(([, patterns]) =>
    patterns.some((p) => matches(file, p)),
  )?.[0] ??
  blockOf(file) ??
  path.posix.basename(file).replace(/\.(tsx?|css)$/u, "")

const kindOf = (name, owned) =>
  name === "base"
    ? "registry:item"
    : owned.every((file) => blockOf(file))
      ? "registry:block"
      : "registry:component"

function specifiers(source, css) {
  // Statements only: a line that starts with import or export, so import-like text inside strings is not read.
  // Either quote style, so a single-quoted import cannot drop a dependency unnoticed. Side-effect imports count
  // (pen/objects registers its collections that way), and so do stylesheet @imports, which bring the fonts.
  const pattern = css
    ? /^@import\s+["']([^"']+)["']/gmu
    : /^\s*(?:import|export)\s[^"']*?from\s+["']([^"']+)["']|^\s*import\s+["']([^"']+)["']/gmu
  return [...source.matchAll(pattern)].map(([, from, bare]) => from ?? bare)
}

function resolveInternal(from, specifier, files) {
  const base = specifier.startsWith(alias)
    ? specifier.slice(alias.length)
    : path.posix.join(path.posix.dirname(from), specifier)
  const found = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}/index.ts`,
    `${base}/index.tsx`,
  ].find((candidate) => files.includes(candidate))
  if (!found)
    throw new Error(`${from}: cannot resolve "${specifier}" inside the kit.`)
  return found
}

const packageName = (s) =>
  s.startsWith("@") ? s.split("/").slice(0, 2).join("/") : s.split("/")[0]

function versioned(name) {
  const version =
    manifest.dependencies?.[name] ?? manifest.devDependencies?.[name]
  if (!version)
    throw new Error(`${name} is imported by the kit but not in package.json.`)
  return `${name}@${version}`
}

const title = (name) =>
  name
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ")

export function buildRegistry({ base } = {}) {
  const files = walk(kit)
    .map((file) => file.slice(kit.length + 1))
    .sort()
  // shadcn add rewrites each import to the installed file with the same base name, so two modules called seed.ts
  // and seed.tsx get mixed up in the consumer, and so do x.tsx and a folder x/ imported through its index.
  const modules = files.filter((f) => /\.tsx?$/u.test(f))
  const folders = modules
    .filter((f) => /\/index\.tsx?$/u.test(f))
    .map((f) => path.posix.basename(path.posix.dirname(f)))
  const names = [
    ...modules.map((f) => path.posix.basename(f).replace(/\.tsx?$/u, "")),
    ...folders,
  ]
  const twins = [
    ...new Set(names.filter((n, i) => n !== "index" && names.indexOf(n) !== i)),
  ]
  if (twins.length)
    throw new Error(
      `Kit modules need unique file names, since shadcn add matches imports by name: ${twins.join(", ")}`,
    )
  const members = new Map()
  for (const file of files)
    members.set(groupOf(file), [...(members.get(groupOf(file)) ?? []), file])
  const address = (name) =>
    base ? `${base}/${name}.json` : `@fineliner/${name}`

  const items = [...members].map(([name, owned]) => {
    const packages = new Set(peers[name] ?? [])
    const stylesheetPackages = new Set()
    // requires: items a part is used with but does not import.
    const needs = new Set([
      ...(name === "base" ? [] : ["base"]),
      ...(requires[name] ?? []),
    ])
    for (const file of owned) {
      const source = fs.readFileSync(path.join(root, kit, file), "utf8")
      for (const specifier of specifiers(source, file.endsWith(".css"))) {
        if (specifier.startsWith("@/") && !specifier.startsWith(alias))
          throw new Error(`${file}: kit files may not import "${specifier}".`)
        if (specifier.startsWith(alias) || specifier.startsWith(".")) {
          const target = groupOf(resolveInternal(file, specifier, files))
          if (target !== name) needs.add(target)
        } else if (!provided.has(packageName(specifier)))
          (file.endsWith(".css") ? stylesheetPackages : packages).add(
            packageName(specifier),
          )
      }
    }
    // base takes a few files from pen/ (seed, filters); if one of them imported the rest of the engine, base and pen
    // would depend on each other.
    if (name === "base" && needs.size)
      throw new Error(
        `base must stand alone, but its files import from ${[...needs].join(", ")}; move those files into base.`,
      )
    // Stylesheet imports compile at build time, so the host needs them only as development dependencies.
    const buildOnly = [
      ...(devDependencies[name] ?? []),
      ...[...stylesheetPackages].filter((d) => !packages.has(d)),
    ].sort()
    return {
      name,
      type: kindOf(name, owned),
      title: title(name),
      description:
        descriptions[name] ?? `${title(name)}, in the Fineliner style.`,
      ...(packages.size && {
        dependencies: [...packages].sort().map(versioned),
      }),
      ...(buildOnly.length && { devDependencies: buildOnly.map(versioned) }),
      ...(needs.size && {
        registryDependencies: [...needs].sort().map(address),
      }),
      files: owned.map((file) => ({
        path: `${kit}/${file}`,
        type: "registry:file",
        target: `~/${kit}/${file}`,
      })),
    }
  })

  items.sort((a, b) =>
    a.name === "base"
      ? -1
      : b.name === "base"
        ? 1
        : a.name.localeCompare(b.name),
  )
  // The umbrella is the kit; blocks are pages to start from, added one at a time.
  items.push({
    name: "fineliner",
    type: "registry:item",
    title: "Fineliner",
    description: descriptions.fineliner,
    registryDependencies: items
      .filter((item) => item.type !== "registry:block")
      .map((item) => address(item.name)),
    files: [],
  })
  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "fineliner",
    homepage: "https://naiveindieline.com",
    items,
  }
}

function shadcnBuild(registryFile, output) {
  const cli = path.join(root, "node_modules/shadcn/dist/index.js")
  const result = spawnSync(
    process.execPath,
    [cli, "build", registryFile, "--output", output],
    { cwd: root, encoding: "utf8" },
  )
  if (result.status !== 0)
    throw new Error(`shadcn build failed:\n${result.stdout}\n${result.stderr}`)
}

const readDir = (dir) =>
  fs.existsSync(dir)
    ? Object.fromEntries(
        fs
          .readdirSync(dir)
          .sort()
          .map((f) => [f, fs.readFileSync(path.join(dir, f), "utf8")]),
      )
    : {}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const option = (flag) =>
    args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined
  const base = option("--base")
  const out = option("--out")
  const json = `${JSON.stringify(buildRegistry({ base }), null, 2)}\n`
  const items = JSON.parse(json).items.length

  if (args.includes("--check")) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fineliner-registry-"))
    fs.writeFileSync(path.join(tmp, "registry.json"), json)
    shadcnBuild(path.join(tmp, "registry.json"), path.join(tmp, "r"))
    const stale = []
    const committed = path.join(root, "registry.json")
    if (
      !fs.existsSync(committed) ||
      fs.readFileSync(committed, "utf8") !== json
    )
      stale.push("registry.json")
    const built = readDir(path.join(tmp, "r"))
    const published = readDir(path.join(root, "public/r"))
    for (const f of new Set([...Object.keys(built), ...Object.keys(published)]))
      if (built[f] !== published[f]) stale.push(`public/r/${f}`)
    fs.rmSync(tmp, { recursive: true, force: true })
    if (stale.length) {
      console.error(
        `registry is stale (run npm run registry): ${stale.join(", ")}`,
      )
      process.exit(1)
    }
    console.log(`registry up to date: ${items} items`)
  } else {
    // The default paths are relative to the repository root, where shadcn build runs; --out is relative to the shell.
    const dir = out ? path.resolve(out) : root
    const registryFile = out ? path.join(dir, "registry.json") : "registry.json"
    const output = out ? path.join(dir, "r") : "public/r"
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, "registry.json"), json)
    fs.rmSync(path.resolve(root, output), { recursive: true, force: true })
    shadcnBuild(registryFile, output)
    console.log(
      `registry.json and ${out ? `r in ${dir}` : output}: ${items} items${base ? ` (dependencies at ${base})` : ""}`,
    )
  }
}
