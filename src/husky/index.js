import { packageManagerRunCommand, detectPackageManager } from "../utilities/package-manager.js";

function extensions(answers, includeJavaScript = true, includeTypeDefinitions = false) {
  let isReact = answers.react;
  let includeTypeScript = answers.checks.includes("typescript");

  let extensions = [];

  if (includeJavaScript) {
    extensions.push("js");
  }

  if (isReact && includeJavaScript) {
    extensions.push("jsx");
  }

  if (includeTypeScript) {
    extensions.push("ts");
  }

  if (isReact && includeTypeScript) {
    extensions.push("tsx");
  }

  if (includeTypeScript && includeTypeDefinitions) {
    extensions.push("d.ts");
  }

  return extensions.length === 1 ? extensions[0] : `{${extensions.join(",")}}`;
}

export default (plop) => {
  plop.setGenerator("husky", {
    description: "Runs checks on staged files with Husky and lint-staged",
    prompts: [
      {
        type: "checkbox",
        name: "checks",
        message: "Which checks would you like to include?",
        choices: [
          { name: "Prettier", value: "prettier", checked: true },
          { name: "TypeScript", value: "typescript", checked: true },
          { name: "ESLint", value: "eslint", checked: true },
          { name: "Test", value: "test", checked: true },
        ],
      },
      {
        type: "confirm",
        name: "react",
        message: "Is this a React project?",
      },
    ],
    actions: (answers) => {
      let includeTypeScript = answers.checks.includes("typescript");
      let includePrettier = answers.checks.includes("prettier");
      let includeESLint = answers.checks.includes("eslint");
      let includeTest = answers.checks.includes("test");

      let data = { runCommand: packageManagerRunCommand().join(" ") };

      let packages = [
        { name: "husky", dev: true },
        { name: "lint-staged", dev: true },
      ];

      if (includeTypeScript) {
        packages.push({ name: "tsc-files", dev: true });
      }

      let checks = {};

      if (includePrettier) {
        checks["*"] = "prettier --check --cache --ignore-unknown";
      }

      if (includeTypeScript) {
        checks[`*.${extensions(answers, false, true)}`] = "tsc-files --noEmit";
      }

      if (includeESLint) {
        checks[`*.${extensions(answers)}`] = "eslint";
      }

      if (includeTest) {
        checks[`*.test.${extensions(answers)}`] = `${detectPackageManager()} test`;
      }

      return [
        {
          type: "addPackages",
          packages,
        },
        {
          type: "add",
          path: ".husky/pre-commit",
          templateFile: "src/husky/pre-commit.hbs",
          force: true,
          data,
        },
        {
          type: "mergeJSON",
          path: "package.json",
          data: {
            scripts: {
              prepare: "husky",
            },
          },
        },
        {
          type: "writeJSON",
          path: ".lintstagedrc.json",
          data: checks,
        },
        {
          type: "executeWithPackageManager",
          command: ["husky"],
        },
      ];
    },
  });
};
