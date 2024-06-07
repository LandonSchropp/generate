import { humanizeList, compact } from "../utilities/array.js";
import { execa } from "execa";
import { pathExists } from "fs-extra";

async function detectPackageManager() {
  if (await pathExists("yarn.lock")) {
    return "yarn";
  }

  if (await pathExists("pnpm-lock.yaml")) {
    return "pnpm";
  }

  if (await pathExists("bun.lock")) {
    return "bun";
  }

  return "npm";
}

async function addPackagesCommand(packages, dev) {
  let packageManager = await detectPackageManager();

  switch (packageManager) {
    case "yarn":
      return compact(["yarn", "add", dev ? "--dev" : null, ...packages]);
    case "pnpm":
      return compact(["pnpm", "add", dev ? "--save-dev" : null, ...packages]);
    case "bun":
      return compact(["bun", "add", dev ? "--save-dev" : null, ...packages]);
    default:
      return compact(["npm", "install", dev ? "--save-dev" : "--save", ...packages]);
  }
}

async function addPackages(packages, dev) {
  if (packages.length === 0) {
    return;
  }

  let command = await addPackagesCommand(packages, dev);

  try {
    await execa(command[0], command.slice(1));
  } catch (error) {
    throw `Failed to add ${humanizeList(packages)}:\n\n${error.message}`;
  }

  return `Added ${dev ? "dev " : ""}packages ${humanizeList(packages)}`;
}

export default async (_answers, { packages }) => {
  let regularNames = packages.filter(({ dev }) => !dev).map(({ name }) => name);
  let devNames = packages.filter(({ dev }) => dev).map(({ name }) => name);

  await addPackages(regularNames, false);
  await addPackages(devNames, true);
};
