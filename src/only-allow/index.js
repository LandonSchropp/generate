import { detectPackageManager } from "../utilities/package-manager.js";

export default (plop) => {
  plop.setGenerator("only-allow", {
    description: "Sets up only-allow to enforce a single package manager",
    prompts: [],
    actions: () => {
      return [
        {
          type: "mergeJSON",
          path: "package.json",
          json: {
            scripts: {
              preinstall: `npx only-allow ${detectPackageManager()}`,
            },
          },
        },
      ];
    },
  });
};
