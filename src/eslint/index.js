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
      ].join(",");

      let data = { typescript, react, jest, browser, node, extensions };

      let names = [
        "eslint",
        "@eslint/js",
        "eslint-config-prettier",
        "globals",
        ...(typescript ? ["typescript-eslint"] : []),
        ...(react ? ["eslint-plugin-react"] : []),
        ...(jest ? ["eslint-plugin-jest"] : []),
      ];

      return [
        {
          type: "installPackage",
          names,
          dev: true,
        },
        {
          type: "add",
          path: "eslint.config.js",
          templateFile: "src/eslint/eslint.config.js.hbs",
          force: true,
          data,
        },
      ];
    },
  });
};
