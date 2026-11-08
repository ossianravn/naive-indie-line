// The site's sections, in the order the header lists them, inline from md up and in the menu on a phone.
export const NAV = [
  { href: "/specimen", label: "Specimen" },
  { href: "/drawings", label: "Drawings" },
  { href: "/lettering", label: "Lettering" },
  { href: "/desk", label: "Desk" },
  { href: "/docs", label: "Components" },
  { href: "/studio", label: "Studio" },
]

/** The page's own section, and every page under it, marks its link as the current page. */
export const currentOf = (path: string, href: string) =>
  path === href || path.startsWith(`${href}/`) ? "page" : undefined
