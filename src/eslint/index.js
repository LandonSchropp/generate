import { packageManagerLockFile } from "../utilities/package-manager.js";
import { hasDependency } from "../utilities/project.js";

export default (plop) => {
  plop.setGenerator("eslint", {
    description: "Sets up ESLint",
    prompts: [
      {
        type: "checkbox",
        name: "globals",
        message: "Which globals would you like to include?",
        choices: [
          { name: "Browser", value: "browser" },
          { name: "Node", value: "node" },
        ],
      },
    ],
    actions: (answers) => {
      let typescript = hasDependency("typescript");
      let react = hasDependency("react");
      let vitest = hasDependency("vitest");
      let browser = answers.globals.includes("browser");
      let node = answers.globals.includes("node");

      let extensions = [
        "js",
        ...(typescript ? ["ts"] : []),
        ...(react ? ["jsx"] : []),
        ...(typescript && react ? ["tsx"] : []),
      ];

      extensions = extensions.length === 1 ? extensions[0] : `{${extensions.join(",")}}`;

      let data = { typescript, react, vitest, browser, node, extensions };

      return [
        {
          type: "gitSafetyCheck",
        },
        {
          type: "addPackages",
          packages: [
            { name: "eslint", dev: true },
            { name: "@eslint/js", dev: true },
            { name: "eslint-config-prettier", dev: true },
            { name: "globals", dev: true },
            { name: "@eslint/compat", dev: true },
            ...(typescript ? [{ name: "typescript-eslint", dev: true }] : []),
            ...(react
              ? [
                  { name: "eslint-plugin-react", dev: true },
                  { name: "eslint-plugin-react-hooks", dev: true },
                ]
              : []),
            ...(vitest ? [{ name: "@vitest/eslint-plugin", dev: true }] : []),
          ],
        },
        {
          type: "add",
          path: "eslint.config.js",
          templateFile: "src/eslint/eslint.config.js.hbs",
          force: true,
          data,
        },
        {
          type: "mergeJSON",
          path: "package.json",
          json: {
            scripts: {
              lint: "eslint .",
            },
          },
        },
        {
          type: "gitCommit",
          message: "Set up ESLint",
          files: ["package.json", packageManagerLockFile(), "eslint.config.js"],
        },
      ];
    },
  });
};
