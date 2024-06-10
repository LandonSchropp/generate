import { existsSync } from "fs";

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

export function detectPackageManager() {
  if (existsSync("yarn.lock")) {
    return "yarn";
  }

  if (existsSync("pnpm-lock.yaml")) {
    return "pnpm";
  }

  if (existsSync("bun.lock")) {
    return "bun";
  }

  return "npm";
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
