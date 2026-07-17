import js from "@eslint/js";
import globals from "globals";

/**
 * public/scripts/{Anims,OnScroll,Open}.js are classic <script src> files, not modules.
 * They share one global scope and call across files, so every cross-file function has
 * to be declared here or no-undef fires. Keep this list in sync when adding a
 * top-level function that another script or an inline HTML handler calls.
 */
const sharedBrowserGlobals = {
  // Anims.js
  animateWave: "writable",
  stopAnimation: "writable",
  animateClickHint: "writable",
  stopClickHintAnimation: "writable",
  DiffIncrease: "writable",
  createGust: "writable",
  RandomNum: "writable",
  ScrollIntoView: "writable",
  Show: "writable",
  // OnScroll.js
  Snap: "writable",
};

export default [
  { ignores: ["dist/**", "node_modules/**"] },

  js.configs.recommended,

  {
    // Classic scripts: shared global scope, invoked from inline HTML handlers.
    files: ["public/scripts/**/*.js"],
    ignores: ["public/scripts/NotionProjects.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: { ...globals.browser, ...sharedBrowserGlobals },
    },
    rules: {
      // The globals above are intentionally re-declared by the file that owns them.
      "no-redeclare": ["error", { builtinGlobals: false }],
      // Top-level declarations here are consumed by other scripts or by inline
      // handlers in index.html, which ESLint cannot see; locals are still checked.
      "no-unused-vars": ["error", { vars: "local", args: "after-used" }],
    },
  },

  {
    files: ["public/scripts/NotionProjects.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.browser,
    },
  },

  {
    // Build tooling runs in Node.
    files: ["*.js", "*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.node,
    },
  },
];
