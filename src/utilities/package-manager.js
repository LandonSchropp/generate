import { pathExists } from "fs-extra";

export async function detectPackageManager() {
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
