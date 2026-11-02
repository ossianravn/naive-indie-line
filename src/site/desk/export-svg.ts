// A drawing as a file that stands on its own: the classes the kit's stylesheet would paint are written into the SVG
// with the pen, wash and paper the page is using now, and the size and namespace a file needs are added.

export function standaloneSvg(svg: string, el: Element) {
  const style = getComputedStyle(el)
  const pen = style.getPropertyValue("--pen").trim() || "#263152"
  const wash = style.getPropertyValue("--wash").trim() || "#5b72a8"
  const paper = style.getPropertyValue("--paper").trim() || "#ece2ca"
  const view = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg)
  const [w, h] = view ? [view[1], view[2]] : ["640", "440"]
  const css =
    `.ln{fill:none;stroke:${pen};stroke-width:1.35;stroke-linecap:round;stroke-linejoin:round}` +
    `.ink{fill:${pen};stroke:${pen};stroke-width:1.35;stroke-linejoin:round}` +
    `.wash{fill:${wash}}.sheet-fill{fill:${paper}}`
  return svg
    .replace(
      "<svg ",
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" `,
    )
    .replace(/(<svg[^>]*>)/, `$1<style>${css}</style>`)
}

export function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }))
  const a = document.createElement("a")
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
