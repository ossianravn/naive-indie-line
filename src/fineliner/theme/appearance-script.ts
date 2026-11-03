import {
  APPEARANCE,
  PEN_MIX,
  defaultAppearance,
  normalize,
  STORAGE_KEY,
  type Appearance,
} from "./appearance"

/**
 * An inline script for <head> that applies the saved appearance before the first paint, so the page never flashes
 * the wrong paper or pen. Pass the same defaults the app uses at runtime. Unknown saved values fall back to the
 * defaults and the custom pen's numbers are clamped to their ranges, as normalize() does.
 */
export function appearanceScript(defaults: Appearance = defaultAppearance) {
  const fallback = JSON.stringify(normalize(defaults))
  const options = JSON.stringify(APPEARANCE)
  const ranges = JSON.stringify(PEN_MIX)
  return `(()=>{const d=${fallback},o=${options},m=${ranges};let a={};try{a=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||"{}")||{}}catch{}const r=document.documentElement;for(const k in o){if(!o[k].includes(a[k]))a[k]=d[k];if(k!=="theme")r.dataset[k]=a[k]}for(const k in m){let n=a[k]==null?NaN:Math.round(Number(a[k]));n=isFinite(n)?Math.min(m[k][1],Math.max(m[k][0],n)):d[k];r.dataset[k]=n;r.style.setProperty("--"+k.replace(/[A-Z]/g,c=>"-"+c.toLowerCase()),n)}r.dataset.theme=a.theme==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"night":"day"):a.theme;r.dataset.themePreference=a.theme})()`
}
