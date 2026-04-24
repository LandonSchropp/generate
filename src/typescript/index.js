import { findPackageManager, packageManagerLockFile } from "../utilities/package-manager.js";
import { hasDependency } from "../utilities/project.js";

export default (plop) => {
  let bun = findPackageManager() === "bun";

  plop.setGenerator("typescript", {
    description: "Sets up TypeScript (tsconfig.json)",
    prompts: [
      ...(bun
        ? []
        : [
            {
              type: "list",
              name: "type",
              message: "Where will this code run?",
              choices: [
                { name: "Node", value: "node" },
                { name: "Browser", value: "browser" },
              ],
            },
          ]),
      {
        type: "input",
        name: "outDir",
        message: "Which directory should the TypeScript emit files to? (Leave blank for none.)",
      },
    ],
    actions: (answers) => {
      let { type, outDir } = answers;
      let react = hasDependency("react");
      let node = !bun && type === "node";
      let browser = !bun && type === "browser";
      let emit = outDir !== "";

      let data = {
        node,
        browser,
        bun,
        react,
        dom: react || browser,
        bundler: bun || browser,
        emit,
        outDir,
      };

      let scripts = {
        "check-types": "tsc --noEmit",
        ...(emit ? { build: "tsc" } : {}),
      };

      return [
        {
          type: "gitSafetyCheck",
        },
        {
          type: "addPackages",
          packages: [
            { name: "typescript", dev: true },
            ...(bun ? [{ name: "@types/bun", dev: true }] : []),
          ],
        },
        {
          type: "add",
          path: "tsconfig.json",
          templateFile: "src/typescript/tsconfig.json.hbs",
          force: true,
          data,
        },
        {
          type: "mergeJSON",
          path: "package.json",
          json: { scripts },
        },
        {
          type: "gitCommit",
          message: "Set up TypeScript",
          files: ["package.json", packageManagerLockFile(), "tsconfig.json"],
        },
      ];
    },
  });
};
