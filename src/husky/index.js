import {
  packageManagerRunCommand,
  detectPackageManager,
  packageManagerLockFile,
} from "../utilities/package-manager.js";
import { hasDependency } from "../utilities/project.js";

function extensions(
  react,
  typescript,
  { includeJavaScript = true, includeTypeDefinitions = false } = {},
) {
  let extensions = [];

  if (includeJavaScript) {
    extensions.push("js");
  }

  if (react && includeJavaScript) {
    extensions.push("jsx");
  }

  if (typescript) {
    extensions.push("ts");
  }

  if (react && typescript) {
    extensions.push("tsx");
  }

  if (typescript && includeTypeDefinitions) {
    extensions.push("d.ts");
  }

  return extensions.length === 1 ? extensions[0] : `{${extensions.join(",")}}`;
}

export default (plop) => {
  plop.setGenerator("husky", {
    description: "Runs checks on staged files with Husky and lint-staged",
    prompts: [],
    actions: () => {
      let react = hasDependency("react");
      let typescript = hasDependency("typescript");
      let prettier = hasDependency("prettier");
      let eslint = hasDependency("eslint");
      let test = hasDependency("vitest") || hasDependency("jest");

      let data = { runCommand: packageManagerRunCommand().join(" ") };

      let packages = [
        { name: "husky", dev: true },
        { name: "lint-staged", dev: true },
      ];

      if (typescript) {
        packages.push({ name: "tsc-files", dev: true });
      }

      let checks = {};

      if (prettier) {
        checks["*"] = "prettier --check --cache --ignore-unknown";
      }

      if (typescript) {
        checks[
          `*.${extensions(react, typescript, { includeJavaScript: false, includeTypeDefinitions: true })}`
        ] = "tsc-files --noEmit";
      }

      if (eslint) {
        checks[`*.${extensions(react, typescript)}`] = "eslint";
      }

      if (test) {
        checks[`*.test.${extensions(react, typescript)}`] = `${detectPackageManager()} test`;
      }

      return [
        {
          type: "gitSafetyCheck",
        },
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
          json: {
            scripts: {
              prepare: "husky",
            },
          },
        },
        {
          type: "writeJSON",
          path: ".lintstagedrc.json",
          json: checks,
        },
        {
          type: "executeWithPackageManager",
          command: ["husky"],
        },
        {
          type: "gitCommit",
          message: "Set up Husky",
          files: [
            ".husky/pre-commit",
            ".lintstagedrc.json",
            "package.json",
            packageManagerLockFile(),
          ],
        },
      ];
    },
  });
};
