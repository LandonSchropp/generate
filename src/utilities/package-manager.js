import { existsSync } from "fs";
import { join } from "node:path";

const PACKAGE_MANAGER_RUN_COMMANDS = {
  yarn: ["yarn", "exec"],
  pnpm: ["pnpm", "exec"],
  bun: ["bun", "run"],
  npm: ["npm", "run"],
};

const PACKAGE_MANAGER_INSTALL_COMMANDS = {
  yarn: ["yarn", "install"],
  pnpm: ["pnpm", "install"],
  bun: ["bun", "install"],
  npm: ["npm", "install"],
};

const PACKAGE_MANAGER_LOCK_FILES = {
  yarn: "yarn.lock",
  pnpm: "pnpm-lock.yaml",
  bun: "bun.lock",
  npm: "package-lock.json",
};

export function findPackageManager(cwd = process.cwd()) {
  if (existsSync(join(cwd, "yarn.lock"))) {
    return "yarn";
  }

  if (existsSync(join(cwd, "pnpm-lock.yaml"))) {
    return "pnpm";
  }

  if (existsSync(join(cwd, "bun.lock"))) {
    return "bun";
  }

  if (existsSync(join(cwd, "package-lock.json"))) {
    return "npm";
  }

  return null;
}

export function detectPackageManager(cwd = process.cwd()) {
  return findPackageManager(cwd) ?? "npm";
}

export function packageManagerRunCommand(packageManager = detectPackageManager()) {
  return PACKAGE_MANAGER_RUN_COMMANDS[packageManager];
}

export function packageManagerInstallCommand(packageManager = detectPackageManager()) {
  return PACKAGE_MANAGER_INSTALL_COMMANDS[packageManager];
}

export function packageManagerLockFile(packageManager = detectPackageManager()) {
  return PACKAGE_MANAGER_LOCK_FILES[packageManager];
}
