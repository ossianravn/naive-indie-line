import { sharedFilters } from "@/fineliner/pen/filters"

const filters = sharedFilters()

/** The shared SVG filters every frame and rule refers to. Render once, inside <body>. */
export function FinelinerDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute" }}
      dangerouslySetInnerHTML={{ __html: filters }}
    />
  )
}
