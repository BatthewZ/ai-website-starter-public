import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist/", "node_modules/", ".wrangler/", "migrations/"]),

  // Base recommended rules for all TS/JS files in src/
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.backend.json", "./tsconfig.web.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Import sorting for all source files
  {
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

  // React rules scoped to frontend files
  {
    files: ["src/web/**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },

  // Test files and the web test harness — no type-checked rules (excluded from
  // production tsconfigs). The harness exports helpers next to components,
  // which react-refresh would flag; it is never hot-reloaded.
  {
    files: ["src/**/*.test.{ts,tsx}", "src/web/test-utils.tsx"],
    ...tseslint.configs.disableTypeChecked,
    rules: {
      ...tseslint.configs.disableTypeChecked.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "react-refresh/only-export-components": "off",
    },
  },

  // Root config files — no type-checked rules
  {
    files: ["*.config.{js,ts}"],
    ...tseslint.configs.disableTypeChecked,
  },

  // Prettier last to disable conflicting rules
  prettier,
]);
