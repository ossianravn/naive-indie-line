// The specimen page: appearance settings, then everything the pen draws, redrawn whenever the hand changes.
;(function (NIL) {
  "use strict"

  const root = document.documentElement
  const KEY = "nil-specimen"
  const SETTINGS = {
    theme: [["day", "Day"], ["night", "Night"]],
    stock: [["recycled", "Recycled"], ["kraft", "Kraft"], ["bond", "Bond"]],
    pen: [["navy", "Navy"], ["black", "Soft black"], ["sepia", "Sepia"], ["forest", "Forest"], ["oxblood", "Oxblood"]],
    hand: [["calm", "Calm"], ["lively", "Lively"]],
    read: [["newsreader", "Newsreader"], ["garamond", "Garamond"], ["caslon", "Caslon"]],
    script: [["gaegu", "Gaegu"], ["patrick", "Patrick"], ["shadows", "Shadows"]],
    type: [["courier", "Courier Prime"], ["cutive", "Cutive Mono"]],
    labels: [["caps", "Small caps"], ["type", "Typewriter"]],
    containers: [["open", "Open"], ["boxed", "Boxed"]],
    frames: [["pen", "Drawn"], ["css", "Filtered"]],
  }
  const FACES = {
    newsreader: "Newsreader",
    garamond: "EB Garamond",
    caslon: "Libre Caslon Text",
    gaegu: "Gaegu",
    patrick: "Patrick Hand",
    shadows: "Shadows Into Light Two",
    courier: "Courier Prime",
    cutive: "Cutive Mono",
  }
  const WORDS = ["corner-shop", "side-b", "late-bus", "quiet-hours", "window-seat", "last-call", "slow-dance", "back-room", "first-press", "low-light"]

  const state = Object.fromEntries(Object.keys(SETTINGS).map((k) => [k, root.dataset[k]]))
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "{}")
    for (const [k, v] of Object.entries(saved)) if (SETTINGS[k]?.some(([value]) => value === v)) state[k] = v
  } catch {
    // Storage can be unavailable; the defaults stand.
  }
  const apply = () => Object.assign(root.dataset, state)
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      // Not saved; the choice still applies for this visit.
    }
  }
  apply()

  let librarySeed = "shelf-1"
  const pickWord = () => `${WORDS[Math.floor(Math.random() * WORDS.length)]}-${Math.floor(Math.random() * 90 + 10)}`
  const stretch = (svg) => svg.replace("<svg ", '<svg preserveAspectRatio="none" ')
  const seedFor = (el, i) => el.dataset.seed ?? `${el.closest("[data-seed]")?.dataset.seed ?? "page"}:${el.dataset.mark ?? el.className}:${i}`

  const custom = {
    chip(seed, hand) {
      const s = NIL.sheet()
      s.fill(NIL.pen(seed, hand).disc([10, 10], [8.4, 0], [0, 8.4]))
      return s.svg(20, 20)
    },
    "avatar-portrait"(seed, hand) {
      const s = NIL.sheet()
      NIL.people.portrait(s, NIL.pen(seed, hand), NIL.stream(NIL.seedOf(seed), "shape"), [50, 50], 1.05)
      return s.svg(100, 100)
    },
    "empty-crate"(seed, hand) {
      const s = NIL.sheet()
      const p = NIL.pen(seed, hand)
      const T = NIL.shapes
      const b = T.box(s, p, T.depth(NIL.stream(NIL.seedOf(seed), "shape")), [18, 104], 112, 48, 60)
      s.stroke(p.line(b.front(0, 0.5), b.front(1, 0.5)))
      s.stroke(p.edges([b.front(0.4, 0.64), b.front(0.6, 0.64), b.front(0.6, 0.84), b.front(0.4, 0.84)]))
      return s.svg(170, 120, "An empty record crate")
    },
  }

  function mark(name, seed, hand) {
    const M = NIL.marks
    if (custom[name]) return custom[name](seed, hand)
    if (name === "ring-sm") return M.ring(seed, hand, 20, 20)
    if (name === "ring-avatar") return M.ring(seed, hand, 44, 44)
    if (name === "ring" || name === "underline") return stretch(M[name](seed, hand))
    return M[name](seed, hand)
  }

  function decorate() {
    document.querySelectorAll("[data-mark]").forEach((el, i) => {
      el.innerHTML = mark(el.dataset.mark, seedFor(el, i), state.hand)
    })
    document.querySelectorAll(".frame, .ink-fill").forEach((el, i) => {
      const r = NIL.stream(NIL.seedOf(seedFor(el, i)), "frame")
      el.style.setProperty("--wob", `var(--wob-${1 + Math.floor(r.next() * 6)})`)
      for (let n = 1; n <= 4; n++) el.style.setProperty(`--o${n}`, r.between(-0.2, 1).toFixed(2))
    })
  }

  const frames = new ResizeObserver((entries) => entries.forEach((e) => drawFrame(e.target)))
  function drawFrame(el) {
    if (state.frames !== "pen" || !el.offsetWidth) return
    let holder = el.querySelector(":scope > .pen-frame")
    if (!holder) {
      holder = document.createElement("span")
      holder.className = "pen-frame"
      holder.setAttribute("aria-hidden", "true")
      el.prepend(holder)
    }
    holder.innerHTML = NIL.marks.frame(seedFor(el, [...document.querySelectorAll(".frame")].indexOf(el)), state.hand, el.offsetWidth, el.offsetHeight)
  }
  const drawFrames = () => document.querySelectorAll(".frame").forEach(drawFrame)

  function settings() {
    for (const el of document.querySelectorAll("[data-setting]")) {
      const key = el.dataset.setting
      const group = el.querySelector(".segmented, .swatches")
      if (key === "pen") {
        group.innerHTML =
          SETTINGS.pen
            .map(([v, label]) => `<label title="${label}"><input class="visually-hidden" type="radio" name="set-pen" value="${v}" aria-label="${label}"${state.pen === v ? " checked" : ""}><span class="chip" style="color: var(--pen-${v})" data-mark="chip" data-seed="chip-${v}"></span><span class="ring" data-mark="ring-sm" data-seed="ring-${v}"></span></label>`)
            .join("") + `<output></output>`
      } else {
        group.classList.add("frame")
        group.dataset.seed = `setting-${key}`
        group.innerHTML = SETTINGS[key]
          .map(([v, label]) => {
            const face = FACES[v] ? ` style="font-family: '${FACES[v]}'${key === "script" ? "; font-size: 1.1rem" : ""}"` : ""
            return `<label${face}><input class="visually-hidden" type="radio" name="set-${key}" value="${v}"${state[key] === v ? " checked" : ""}><i class="ink-fill"></i>${label}</label>`
          })
          .join("")
      }
      group.addEventListener("change", (e) => {
        state[key] = e.target.value
        apply()
        save()
        update(key)
      })
    }
  }

  const rgb = (str) => str.match(/[\d.]+/g).slice(0, 3).map(Number)
  const lum = (c) => {
    const [r, g, b] = c.map((v) => {
      const s = v / 255
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
    return (x + 0.05) / (y + 0.05)
  }
  const hex = (c) => `#${c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`

  function swatches() {
    const host = document.getElementById("pen-swatches")
    const entries = [
      ...SETTINGS.pen.map(([v, label]) => [label, `var(--pen-${v})`, true]),
      ["Wash", "var(--wash)", false],
      ["Correction", "var(--correction)", true],
    ]
    host.innerHTML = entries
      .map(([name, colour], i) => `<div class="swatch"><span class="chip" style="color: ${colour}" data-mark="chip" data-seed="swatch-${i}"></span><span>${name}</span><span class="num"></span></div>`)
      .join("")
    const paper = rgb(getComputedStyle(document.body).backgroundColor)
    host.querySelectorAll(".swatch").forEach((el, i) => {
      const c = rgb(getComputedStyle(el.querySelector(".chip")).color)
      el.querySelector(".num").textContent = `${hex(c)} · ${ratio(c, paper).toFixed(1)}:1${entries[i][2] ? "" : " (art only)"}`
    })
    const out = document.querySelector(".swatches output")
    if (out) out.textContent = SETTINGS.pen.find(([v]) => v === state.pen)[1]
  }

  function lineDemo() {
    const tiles = [
      ["A line", (s, p) => s.stroke(p.line([8, 44], [112, 30]))],
      ["A box", (s, p) => s.stroke(p.edges([[22, 12], [98, 12], [98, 62], [22, 62]]))],
      ["A circle", (s, p) => s.stroke(p.ring([60, 37], [27, 0], [0, 27]))],
      ["A pocket of ink", (s, p) => (s.fill(p.disc([60, 37], [26, 0], [0, 26])), s.paper(p.disc([60, 37], [7, 0], [0, 7])), s.stroke(p.ring([60, 37], [7, 0], [0, 7])))],
      ["A wash", (s, p) => (s.wash(p.shape([[26, 22], [94, 22], [94, 52], [26, 52]])), s.stroke(p.edges([[26, 22], [94, 22], [94, 52], [26, 52]])))],
    ]
    document.getElementById("line-demo").innerHTML = ["calm", "lively"]
      .map(
        (hand) =>
          `<p class="label row-label">${hand}</p>` +
          tiles
            .map(([name, draw]) => {
              const s = NIL.sheet()
              draw(s, NIL.pen(`line:${name}`, hand))
              return `<figure>${s.svg(120, 74, `${name}, ${hand}`)}<figcaption class="label">${name}</figcaption></figure>`
            })
            .join(""),
      )
      .join("")
  }

  let sceneName = "room"
  function scene() {
    const [, draw] = NIL.scenes[sceneName]
    document.getElementById("scene").innerHTML = draw(document.getElementById("scene-seed").value || "corner-shop", state.hand)
  }

  function sceneChoices() {
    const group = document.getElementById("scene-pick")
    group.classList.add("frame")
    group.dataset.seed = "scene-pick"
    group.innerHTML = Object.entries(NIL.scenes)
      .map(([key, [label]]) => `<label><input class="visually-hidden" type="radio" name="scene" value="${key}"${key === sceneName ? " checked" : ""}><i class="ink-fill"></i>${label}</label>`)
      .join("")
    group.addEventListener("change", (e) => {
      sceneName = e.target.value
      scene()
    })
  }

  function library() {
    document.getElementById("library").innerHTML = NIL.objects.COLLECTIONS.map(([key, title]) => {
      const tiles = NIL.objects
        .list(key)
        .map((o) => `<figure>${NIL.objects.tile(o, librarySeed, state.hand)}<figcaption class="label">${o.name}</figcaption></figure>`)
        .join("")
      return `<h3 class="collection">${title}</h3><div class="library-grid">${tiles}</div>`
    }).join("")
  }

  const SAMPLES = { liner: "Listening room", stilt: "Pét-nat · Side B", ribbon: "Open 10–6", tramline: "Studio 2026" }
  function letters() {
    const own = document.getElementById("letters-text").value.trim()
    document.getElementById("letters").innerHTML = Object.entries(NIL.lettering.FACES)
      .map(([key, face]) => `<figure>${NIL.lettering.draw(own || SAMPLES[key], { face: key, hand: state.hand })}<figcaption class="label">${face.name}</figcaption></figure>`)
      .join("")
  }

  function drawAll() {
    scene()
    letters()
    library()
    lineDemo()
    swatches()
    decorate()
    drawFrames()
  }

  function update(key) {
    if (key === "hand") drawAll()
    else if (key === "frames" || key === "containers") drawFrames()
    else if (key === "theme" || key === "stock" || key === "pen") swatches(), decorate()
  }

  const filters = document.getElementById("filters")
  filters.innerHTML = NIL.paper.filters()
  root.style.setProperty("--texture-day", NIL.paper.tile(false))
  root.style.setProperty("--texture-night", NIL.paper.tile(true))
  document.getElementById("ui").innerHTML = NIL.ui.html()
  settings()
  sceneChoices()
  drawAll()
  document.querySelectorAll(".frame").forEach((el) => frames.observe(el))

  document.getElementById("scene-seed").addEventListener("input", scene)
  document.getElementById("letters-text").addEventListener("input", letters)
  document.addEventListener("click", (e) => {
    const which = e.target.closest("[data-reroll]")?.dataset.reroll
    if (which === "scene") {
      document.getElementById("scene-seed").value = pickWord()
      scene()
    } else if (which === "library") {
      librarySeed = pickWord()
      library()
    }
    const tab = e.target.closest(".tab")
    if (tab) tab.parentElement.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", String(t === tab)))
  })
  document.fonts?.ready.then(drawFrames)
})((window.NIL = window.NIL || {}))
