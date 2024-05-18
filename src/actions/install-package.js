import { execa } from "execa";
import { pathExists } from "fs-extra";

export default async (_answers, { name, dev }, plop) => {
  if (!(await pathExists("pnpm-lock.yaml"))) {
    throw "The installPackage action currently only works with pnpm.";
  }

  if (!name) {
    throw "No package name provided.";
  }

  try {
    await execa("pnpm", ["add", ...(dev ? ["--save-dev"] : []), name]);
  } catch (error) {
    throw `Failed to install package ${name}:\n\n${error.message}`;
  }

  return `Installed "${name}".`;
};
