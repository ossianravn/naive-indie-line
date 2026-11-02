import {
  APPEARANCE,
  defaultAppearance,
  normalize,
  STORAGE_KEY,
  type Appearance,
} from "./appearance"

/**
 * An inline script for <head> that applies the saved appearance before the first paint, so the page never flashes
 * the wrong paper. Pass the same defaults the app uses at runtime. Unknown saved values fall back to the defaults,
 * as normalize() does.
 */
export function appearanceScript(defaults: Appearance = defaultAppearance) {
  const fallback = JSON.stringify(normalize(defaults))
  const options = JSON.stringify(APPEARANCE)
  return `(()=>{const d=${fallback},o=${options};let a={};try{a=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||"{}")||{}}catch{}const r=document.documentElement;for(const k in o){if(!o[k].includes(a[k]))a[k]=d[k];if(k!=="theme")r.dataset[k]=a[k]}r.dataset.theme=a.theme==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"night":"day"):a.theme;r.dataset.themePreference=a.theme})()`
}
