import { isValidElement, type CSSProperties, type ReactNode } from "react"
import { frameVars } from "@/fineliner/pen/filters"
import { seedOf } from "@/fineliner/pen/seed"

// Base UI lets a style be a function of the component's state; plain elements take an object.
type StyleProp<State> =
  CSSProperties | ((state: State) => CSSProperties | undefined) | undefined

/**
 * A floating sheet's distance from its trigger (Base UI's sideOffset). The pen-shadow lies 7px right of and below the
 * sheet, so a sheet that opens above or to the left stands 7px further off, clear of the trigger's frame.
 */
export const clearOfShadow = ({ side }: { side: string }) =>
  /^(top|left|inline-start)$/.test(side) ? 11 : 4

/** Room a floating sheet keeps from the viewport's edges (Base UI's collisionPadding): more right and below, where the
 * pen-shadow falls, so the shadow never pushes a phone page sideways. */
export const shadowRoom = { top: 5, left: 5, right: 12, bottom: 12 }

/** The words in a node, elements included: "Add a record" from [<PlusIcon />, <span> Add a record</span>]. */
export function wordsOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(wordsOf).join("")
  if (isValidElement<{ children?: ReactNode }>(node))
    return wordsOf(node.props.children)
  return ""
}

/**
 * The seeded custom properties a drawn frame reads (which wobble, how far each edge runs past its corners), taken
 * from a control's own words so neighbouring buttons wobble differently and each always the same way. A control with
 * no words (an icon alone) keeps the default wobble. A caller's own style wins.
 */
export function frameStyle(
  source: ReactNode,
  style?: CSSProperties,
): CSSProperties | undefined
export function frameStyle<State>(
  source: ReactNode,
  style?: StyleProp<State>,
): StyleProp<State>
export function frameStyle<State>(
  source: ReactNode,
  style?: StyleProp<State>,
): StyleProp<State> {
  const words = wordsOf(source).trim()
  if (!words) return style
  const vars = frameVars(seedOf(words)) as CSSProperties
  if (typeof style === "function")
    return (state: State) => ({ ...vars, ...style(state) })
  return { ...vars, ...style }
}
