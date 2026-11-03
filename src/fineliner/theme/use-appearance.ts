"use client"

import { useCallback, useSyncExternalStore } from "react"
import {
  APPEARANCE_ATTRIBUTES,
  apply,
  current,
  defaultAppearance,
  save,
  STORAGE_KEY,
  type Appearance,
} from "./appearance"

let cache: { key: string; value: Appearance } | undefined

function snapshot(): Appearance {
  const value = current()
  const key = JSON.stringify(value)
  if (cache?.key !== key) cache = { key, value }
  return cache.value
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: APPEARANCE_ATTRIBUTES,
  })
  // "system" re-resolves when the operating system switches between light and dark.
  const media = window.matchMedia("(prefers-color-scheme: dark)")
  const follow = () => apply(current())
  media.addEventListener("change", follow)
  return () => {
    observer.disconnect()
    media.removeEventListener("change", follow)
  }
}

/**
 * The document's appearance and a setter that applies and saves a change, under the storage key the page's
 * appearanceScript reads. Server renders use the defaults.
 */
export function useAppearance(
  defaults: Appearance = defaultAppearance,
  storageKey = STORAGE_KEY,
) {
  const appearance = useSyncExternalStore(subscribe, snapshot, () => defaults)
  const update = useCallback(
    (change: Partial<Appearance>) => {
      const next = { ...current(), ...change }
      apply(next)
      save(next, storageKey)
    },
    [storageKey],
  )
  return [appearance, update] as const
}
