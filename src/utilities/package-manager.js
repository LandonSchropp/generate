import { existsSync } from "fs";

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

export function packageManagerRunCommand() {
  switch (detectPackageManager()) {
    case "yarn":
      return "yarn exec";
    case "pnpm":
      return "pnpm exec";
    case "bun":
      return "bun run";
    default:
      return "npm run";
  }
}
