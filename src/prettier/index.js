export default (plop) => {
  plop.setGenerator("prettier", {
    description: "Sets up Prettier",
    prompts: [],
    actions: [
      {
        type: "addPackages",
        packages: [
          { name: "prettier", dev: true },
          { name: "@trivago/prettier-plugin-sort-imports", dev: true },
          { name: "prettier-plugin-jsdoc", dev: true },
        ],
      },
      {
        type: "add",
        path: ".prettierrc",
        templateFile: "src/prettier/.prettierrc.json",
        force: true,
      },
      {
        type: "add",
        path: ".prettierignore",
        templateFile: "src/prettier/.prettierignore",
        force: true,
      },
    ],
  });
};
