import js from "@eslint/js";
import globals from "globals";


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
      "no-redeclare": ["error", { builtinGlobals: false }],
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
    files: ["*.js", "*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.node,
    },
  },
];
