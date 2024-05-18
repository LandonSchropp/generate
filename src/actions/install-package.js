import { execa } from "execa";

export default async (_answers, { name, dev }) => {
  if (!(await pathExists("pnpm-lock.yaml"))) {
    throw "The installPackage action currently only works with pnpm.";
  }

  if (!name) {
    throw "No package name provided.";
  }

  try {
    await execa("pnpm", ["install", ...(dev ? ["--dev"] : []), name]);
  } catch {
    throw `Failed to install package ${name}.`;
  }

  return `Installed package ${name}.`;
};
