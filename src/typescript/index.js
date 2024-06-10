import { packageManagerLockFile } from "../utilities/package-manager";

export default (plop) => {
  plop.setGenerator("typescript", {
    description: "Sets up TypeScript (tsconfig.json)",
    prompts: [
      {
        type: "list",
        name: "type",
        message: "What type of project is this?",
        choices: [
          { name: "Node", value: "node" },
          { name: "React", value: "react" },
          { name: "Browser", value: "browser" },
        ],
      },
      {
        type: "input",
        name: "outDir",
        message: "Which directory should the TypeScript emit files to? (Leave blank for none.)",
      },
    ],
    actions: (answers) => {
      let { type, outDir } = answers;
      let emit = outDir !== "";

      let data = {
        node: type === "node",
        react: type === "react",
        reactOrBrowser: type === "react" || type === "browser",
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
          packages: [{ name: "typescript", dev: true }],
          dev: true,
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
