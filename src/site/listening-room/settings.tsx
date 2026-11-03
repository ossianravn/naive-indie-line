import { Settings01 } from "@/fineliner/blocks/settings-01"
import { PageHeader, ShellPage } from "./page"

/** Listening Room's settings: the kit's settings-01 block, as a consumer installs it, inside the shell's page frame. */
export function SettingsPage() {
  return (
    <ShellPage>
      <PageHeader kicker="Behind the counter · Maya Singh" title="Settings" />
      <Settings01
        bare
        appearance={["theme", "stock", "pen"]}
        className="mt-line"
      />
    </ShellPage>
  )
}
