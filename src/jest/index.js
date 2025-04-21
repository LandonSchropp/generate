import { packageManagerLockFile } from "../utilities/package-manager.js";

export default (plop) => {
  plop.setGenerator("jest", {
    description: "Sets up Jest",
    prompts: [
      {
        type: "confirm",
        name: "typescript",
        message: "Are you using TypeScript?",
        default: true,
      },
      {
        type: "confirm",
        name: "react",
        message: "Are you using React?",
        default: true,
      },
    ],
    actions: (answers) => {
      if (!answers.typescript) {
        throw new Error("TypeScript is currently required for this generator.");
      }

      // TODO: Should I account for Next.js like this: https://shorturl.at/GVK35?

      return [
        {
          type: "gitSafetyCheck",
        },
        {
          type: "addPackages",
          packages: [
            { name: "@jest/globals", dev: true },
            { name: "@types/jest", dev: true },
            { name: "jest", dev: true },
            { name: "jest-extended", dev: true },
            { name: "ts-jest", dev: true },
            { name: "ts-node", dev: true },
            ...(answers.react
              ? [
                  { name: "jest-environment-jsdom", dev: true },
                  { name: "@testing-library/dom", dev: true },
                  { name: "@testing-library/jest-dom", dev: true },
                ]
              : []),
          ],
        },
        {
          type: "add",
          path: "jest.config.ts",
          templateFile: "src/jest/jest.config.ts.hbs",
          force: true,
          data: answers,
        },
        {
          type: "add",
          path: "jest.setup.ts",
          templateFile: "src/jest/jest.setup.ts.hbs",
          force: true,
          data: answers,
        },
        {
          type: "gitCommit",
          message: "Set up Jest",
          files: ["package.json", packageManagerLockFile(), "jest.config.ts", "jest.setup.ts"],
        },
      ];
    },
  });
};
