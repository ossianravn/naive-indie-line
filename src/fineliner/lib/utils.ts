import { createCn } from "cn/config"

// Class merging that knows Fineliner's theme. Without this, cn reads `text-small` or `text-label` as a text colour and
// drops it when a colour class such as `text-pen` follows; the same goes for the φ spacing names and the voices.
// Every kit component imports cn from here, not from "cn".
export const cn = createCn({
  extend: {
    theme: {
      text: [
        "label",
        "small",
        "ui",
        "body",
        "lead",
        "h2",
        "h1",
        "title",
        "display",
      ],
      leading: ["body", "small", "ui", "heading", "subhead", "display", "lead"],
      spacing: [
        "hair",
        "tight",
        "snug",
        "line",
        "section",
        "page",
        "control",
        "control-compact",
      ],
      font: ["read", "type", "label", "hand", "ui"],
    },
  },
})
