import { packageManagerLockFile } from "../utilities/package-manager.js";
import { hasDependency } from "../utilities/project.js";

export default (plop) => {
  plop.setGenerator("vitest", {
    description: "Sets up Vitest",
    prompts: [],
    actions: () => {
      let typescript = hasDependency("typescript");
      let react = hasDependency("react");
      let extension = typescript ? "ts" : "js";
      let data = { typescript, react };

      return [
        {
          type: "gitSafetyCheck",
        },
        {
          type: "addPackages",
          packages: [
            { name: "vitest", dev: true },
            ...(react
              ? [
                  { name: "jsdom", dev: true },
                  { name: "@testing-library/dom", dev: true },
                  { name: "@testing-library/jest-dom", dev: true },
                ]
              : []),
          ],
        },
        {
          type: "add",
          path: `vitest.config.${extension}`,
          templateFile: "src/vitest/vitest.config.hbs",
          force: true,
          data,
        },
        {
          type: "mergeJSON",
          path: "package.json",
          json: {
            scripts: {
              test: "vitest run",
            },
          },
        },
        {
          type: "gitCommit",
          message: "Set up Vitest",
          files: ["package.json", packageManagerLockFile(), `vitest.config.${extension}`],
        },
      ];
    },
  });
};
