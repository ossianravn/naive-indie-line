import { ToggleGroup, ToggleGroupItem } from "@/fineliner/ui/toggle-group"

/** A segmented control that always keeps one choice. */
export function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: [T, string][]
  onChange: (value: T) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-tight">
      <span className="label text-pen-quiet">{label}</span>
      <ToggleGroup
        aria-label={label}
        variant="outline"
        size="sm"
        spacing={0}
        value={[value]}
        onValueChange={(next) => next[0] && onChange(next[0] as T)}
      >
        {options.map(([key, name]) => (
          <ToggleGroupItem key={key} value={key}>
            {name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
