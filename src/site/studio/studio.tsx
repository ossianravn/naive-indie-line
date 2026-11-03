import { useState } from "react"
import { Dashboard01 } from "@/fineliner/blocks/dashboard-01"
import { AppearanceControl } from "@/fineliner/extras/appearance-control"
import { useAppearance } from "@/fineliner/theme"
import { siteAppearance } from "@/site/appearance"
import { ExportPanel } from "./export-panel"
import { PresetPicker } from "./preset-picker"
import { matchPreset } from "./presets"
import { Specimens } from "./specimens"

/**
 * The theme studio: presets across the top, every appearance setting in a narrow column that stays in view on wide
 * screens, the shop's dashboard and every kind of part beside it, and the export below. Settings apply to the whole site and
 * persist, like the appearance control anywhere else.
 */
export function Studio() {
  const [appearance, update] = useAppearance(siteAppearance)
  const preset = matchPreset(appearance)
  const [customName, setCustomName] = useState<string | null>(null)
  const name = customName ?? preset?.name ?? "Custom"

  return (
    <div className="flex flex-col gap-y-section">
      <PresetPicker
        current={preset}
        onPick={(next) => {
          update(next.choices)
          setCustomName(null)
        }}
      />
      {/* Side by side from 80rem, where the previews get the width the dashboard needs; narrower, the settings come
          first. Beside the previews the settings stay in view, capped to the window and scrolling on their own when
          the window is shorter than they are. */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-x-section gap-y-line xl:grid-cols-[24rem_minmax(0,1fr)]">
        <aside
          aria-label="Theme settings"
          className="max-w-[42rem] xl:sticky xl:top-snug xl:max-h-[calc(100dvh-2*var(--space-snug))] xl:self-start xl:overflow-y-auto xl:overscroll-contain xl:pe-tight"
        >
          <section aria-labelledby="studio-settings">
            <h2 id="studio-settings" className="label m-0 text-pen-quiet">
              Settings
            </h2>
            <AppearanceControl defaults={siteAppearance} className="mt-hair" />
            <a href="#export" className="label mt-snug inline-block">
              Export {name}
            </a>
          </section>
        </aside>
        {/* The dashboard is a whole page; here it drops its page margins so both previews share one left edge. */}
        <div className="@container grid min-w-0 content-start gap-section">
          <h2 className="sr-only">Previews</h2>
          <Dashboard01 className="*:px-0! *:pt-0! *:pb-0!" />
          <Specimens />
        </div>
      </div>
      <ExportPanel name={name} onName={setCustomName} />
    </div>
  )
}
