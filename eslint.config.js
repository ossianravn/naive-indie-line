import js from "@eslint/js"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"
import astro from "eslint-plugin-astro"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"

export default defineConfig(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".astro/**",
      ".artifacts/**",
      ".dev-docs/**",
      "specimen/**",
    ],
  },
  {
    files: ["tools/**/*.mjs", "tests/**/*.mjs", "*.{js,mjs}"],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: { globals: globals.browser },
  },
  ...astro.configs.recommended,
  {
    // The kit is installed into other projects, so it cannot depend on the site.
    files: ["src/fineliner/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^(@/|(\\.\\./)+)(site|pages|content)(/|$)",
              message:
                "Kit code cannot depend on the site, its pages or its content.",
            },
          ],
        },
      ],
    },
  },
  {
    // The pen engine runs at build time, in share-image rendering and in the browser.
    files: ["src/fineliner/pen/**/*.ts"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "react", message: "The pen engine is framework-free." },
            { name: "react-dom", message: "The pen engine is framework-free." },
          ],
          patterns: [
            {
              regex: "^(@/|(\\.\\./)+)(site|pages|content|fineliner/(?!pen))",
              message: "The pen engine imports only from itself.",
            },
          ],
        },
      ],
      "no-restricted-globals": [
        "error",
        ...[
          "window",
          "document",
          "navigator",
          "localStorage",
          "getComputedStyle",
          "requestAnimationFrame",
        ].map((name) => ({
          name,
          message: "The pen engine runs without a DOM.",
        })),
      ],
      "no-restricted-properties": [
        "error",
        {
          object: "Math",
          property: "random",
          message: "Draw randomness from prng(seed).",
        },
        {
          object: "Date",
          property: "now",
          message: "Draw randomness from prng(seed).",
        },
      ],
    },
  },
)
