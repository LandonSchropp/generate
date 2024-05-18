export default (plop) => {
  plop.setGenerator("prettier", {
    description: "Sets up Prettier",
    prompts: [],
    actions: [
      {
        type: "installPackage",
        name: "prettier",
        dev: true,
      },
      {
        type: "installPackage",
        name: "@trivago/prettier-plugin-sort-imports",
        dev: true,
      },
      {
        type: "installPackage",
        name: "prettier-plugin-jsdoc",
        dev: true,
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
