import { detectPackageManager } from "../utilities/package-manager.js";

export default (plop) => {
  plop.setGenerator("only-allow", {
    description: "Sets up only-allow to enforce a single package manager",
    prompts: [],
    actions: () => {
      return [
        {
          type: "gitSafetyCheck",
        },
        {
          type: "mergeJSON",
          path: "package.json",
          json: {
            scripts: {
              preinstall: `pnpm dlx only-allow ${detectPackageManager()}`,
            },
          },
        },
        {
          type: "gitCommit",
          message: "Set up only-allow",
          files: ["package.json"],
        },
      ];
    },
  });
};
