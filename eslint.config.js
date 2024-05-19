import globals from "globals";
import javascript from "@eslint/js";
import prettier from "eslint-config-prettier";

export default [
  javascript.configs.recommended,
  prettier,
  {
    files: ["**/*.{js}"],
    languageOptions: {
      globals: {
        ...globals.node,
      }
    }
  },
];
