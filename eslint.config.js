import { includeIgnoreFile } from "@eslint/compat";
import javascript from "@eslint/js";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import globals from "globals";
import { fileURLToPath } from "node:url";

const GITIGNORE_PATH = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([
  includeIgnoreFile(GITIGNORE_PATH),
  {
    ignores: ["**/*.d.ts"],
  },
  javascript.configs.recommended,
  prettier,
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]);
