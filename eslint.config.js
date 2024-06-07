import javascript from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
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
];
