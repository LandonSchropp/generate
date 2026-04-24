import { packageManagerLockFile } from "../utilities/package-manager.js";

export default (plop) => {
  plop.setGenerator("vitest", {
    description: "Sets up Vitest",
    prompts: [
      {
        type: "confirm",
        name: "typescript",
        message: "Is this a TypeScript project?",
      },
      {
        type: "confirm",
        name: "react",
        message: "Is this a React project?",
      },
    ],
    actions: (answers) => {
      let extension = answers.typescript ? "ts" : "js";

      return [
        {
          type: "gitSafetyCheck",
        },
        {
          type: "addPackages",
          packages: [
            { name: "vitest", dev: true },
            ...(answers.react
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
          data: answers,
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
