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

      let data = {
        node: type === "node",
        react: type === "react",
        reactOrBrowser: type === "react" || type === "browser",
        emit: outDir !== "",
        outDir,
      };

      return [
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
      ];
    },
  });
};
