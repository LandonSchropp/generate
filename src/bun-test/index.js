export default (plop) => {
  plop.setGenerator("bun-test", {
    description: "Sets up bun test",
    prompts: [],
    actions: () => {
      return [
        {
          type: "gitSafetyCheck",
        },
        {
          type: "add",
          path: "bunfig.toml",
          templateFile: "src/bun-test/bunfig.toml.hbs",
          force: true,
        },
        {
          type: "add",
          path: "test/setup.ts",
          templateFile: "src/bun-test/setup.ts.hbs",
          force: true,
        },
        {
          type: "appendToFile",
          path: ".gitignore",
          content: "coverage",
        },
        {
          type: "mergeJSON",
          path: "package.json",
          json: {
            scripts: {
              test: "bun test",
            },
          },
        },
        {
          type: "gitCommit",
          message: "Set up bun test",
          files: ["bunfig.toml", "test/setup.ts", ".gitignore", "package.json"],
        },
      ];
    },
  });
};
