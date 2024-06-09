const PLUGINS_MESSAGE = "Which ESLint plugins do you want to use?";
const GLOBALS_MESSAGE = "Which globals would you like to include?";

export default (plop) => {
  plop.setGenerator("eslint", {
    description: "Sets up ESLint",
    prompts: [
      {
        type: "checkbox",
        name: PLUGINS_MESSAGE,
        choices: [
          { name: "TypeScript", value: "typescript" },
          { name: "React", value: "react" },
          { name: "Jest", value: "jest" },
        ],
      },
      {
        type: "checkbox",
        name: GLOBALS_MESSAGE,
        choices: [
          { name: "Browser", value: "browser" },
          { name: "Node", value: "node" },
        ],
      },
    ],
    actions: (answers) => {
      let typescript = answers[PLUGINS_MESSAGE].includes("typescript");
      let react = answers[PLUGINS_MESSAGE].includes("react");
      let jest = answers[PLUGINS_MESSAGE].includes("jest");
      let browser = answers[GLOBALS_MESSAGE].includes("browser");
      let node = answers[GLOBALS_MESSAGE].includes("node");

      let extensions = [
        "js",
        ...(typescript ? ["ts"] : []),
        ...(react ? ["jsx"] : []),
        ...(typescript && react ? ["tsx"] : []),
      ];

      extensions = extensions.length === 1 ? extensions[0] : `{${extensions.join(",")}}`;

      let data = { typescript, react, jest, browser, node, extensions };

      return [
        {
          type: "addPackages",
          packages: [
            { name: "eslint", dev: true },
            { name: "@eslint/js", dev: true },
            { name: "eslint-config-prettier", dev: true },
            { name: "globals", dev: true },
            ...(typescript ? [{ name: "typescript-eslint", dev: true }] : []),
            ...(react ? [{ name: "eslint-plugin-react", dev: true }] : []),
            ...(jest ? [{ name: "eslint-plugin-jest", dev: true }] : []),
          ],
        },
        {
          type: "add",
          path: "eslint.config.js",
          templateFile: "src/eslint/eslint.config.js.hbs",
          force: true,
          data,
        },
        {
          type: "mergeJSON",
          path: "package.json",
          json: {
            scripts: {
              lint: "eslint .",
            },
          },
        },
      ];
    },
  });
};
