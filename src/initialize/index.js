import { getGitHubUsername, getGitUserName, getGitUserEmail } from "../utilities/git.js";
import { readJson } from "fs-extra/esm";
import { dirname } from "path";

export default async (plop) => {
  // TODO: This slows down reading all of the generators. It would be nice if instead it could be
  // done async inside of the prompts, but that's not currently allowed by Plop.
  let packageJson = (await readJson("package.json")) ?? {};
  let gitHubUsername = await getGitHubUsername();
  let gitUserName = await getGitUserName();
  let gitUserEmail = await getGitUserEmail();

  let defaultPackageName = dirname(plop.getDestBasePath());
  let defaultRepository = gitHubUsername
    ? `https://github.com/${gitHubUsername}/${defaultPackageName.replace(/.*\//, "")}`
    : null;
  let defaultAuthor = gitUserName && gitUserEmail ? `${gitUserName} <${gitUserEmail}>` : null;

  plop.setGenerator("initialize", {
    description: "Creates a package.json file",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of your project?",
        default: packageJson.name ?? defaultPackageName,
      },
      {
        type: "input",
        name: "description",
        message: "How would you describe your project?",
        default: packageJson.description ?? packageJson.description,
      },
      {
        type: "input",
        name: "author",
        message: "Who is the author? (Leave blank for none)",
        default: packageJson.author ?? defaultAuthor,
      },
      {
        type: "input",
        name: "repository",
        message: "What is the repository URL? (Leave blank for none)",
        default: packageJson.repository ?? defaultRepository,
      },
      {
        type: "list",
        name: "license",
        message: "Which license would you like to use?",
        choices: [
          { name: "MIT", value: "MIT" },
          { name: "Unlicensed", value: "UNLICENSED" },
        ],
      },
      {
        type: "confirm",
        name: "privatePackage",
        message: "Is this a private package?",
        default: packageJson.private ?? false,
      },
      {
        type: "confirm",
        name: "module",
        message: "Is this an ES module?",
        default: packageJson.type ? packageJson.type === "module" : true,
      },
      {
        type: "input",
        name: "version",
        message: "Which version would you like to use? (Leave blank for none)",
        default: packageJson.version,
      },
      {
        type: "choice",
        name: "packageManager",
        message: "Which package manager would you like to use?",
        choices: [
          { name: "pnpm", value: "pnpm" },
          { name: "Bun", value: "bun" },
          { name: "Yarn", value: "yarn" },
          { name: "NPM", value: "npm" },
        ],
      },
    ],
    actions: (answers) => {
      let packageJson = {
        name: answers.name,
        description: answers.description,
        ...(answers.author ? { author: answers.author } : {}),
        ...(answers.repository ? { repository: answers.repository } : {}),
        license: answers.license,
        ...(answers.privatePackage ? { private: answers.privatePackage } : {}),
        ...(answers.module ? { type: "module" } : {}),
        ...(answers.version ? { version: answers.version } : {}),
      };

      return [
        {
          type: "mergeJSON",
          path: "package.json",
          json: packageJson,
        },
        {
          type: "installPackages",
          packageManager: answers.packageManager,
        },
      ];
    },
  });
};
