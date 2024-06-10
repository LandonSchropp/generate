import { compact } from "../utilities/array.js";
import {
  detectPackageManager,
  packageManagerInstallCommand,
  packageManagerRunCommand,
} from "../utilities/package-manager.js";
import chalk from "chalk";
import { execa } from "execa";

async function addPackagesCommand(packages, dev) {
  let packageManager = detectPackageManager();

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

function packageList(packages) {
  return chalk.cyan(packages.join(", "));
}

async function runAddPackagesCommand(packages, dev) {
  if (packages.length === 0) {
    return;
  }

  let command = await addPackagesCommand(packages, dev);

  try {
    await execa(command[0], command.slice(1));
  } catch (error) {
    throw `Failed to add ${packageList(packages)}:\n\n${chalk.red(error.message)}`;
  }

  return `Added ${dev ? "dev " : ""}packages ${packageList(packages)}`;
}

function printAddPackagesMessage(name, names) {
  if (names.length === 0) {
    return;
  }

  console.log(`Adding ${name}: ${packageList(names)}`);
}

/**
 * This action adds packages using the package manager. It takes an array of packages, each with a
 * name and a dev boolean indicating whether it is a dev dependency.
 */
export async function addPackages(_answers, { packages }) {
  let dependencies = packages.filter(({ dev }) => !dev).map(({ name }) => name);
  let devDependencies = packages.filter(({ dev }) => dev).map(({ name }) => name);

  printAddPackagesMessage("dependencies", dependencies);
  printAddPackagesMessage("devDependencies", devDependencies);

  await runAddPackagesCommand(dependencies, false);
  await runAddPackagesCommand(devDependencies, true);

  return `Added packages: ${packageList(packages.map(({ name }) => name))}`;
}

/** This action runs a command with the package manager's run/exec command. */
export async function executeWithPackageManager(_answers, { command }) {
  if (typeof command === "string") {
    command = command.trim().split(/\s+/);
  }

  let runCommand = [...packageManagerRunCommand(), ...command];

  try {
    await execa(runCommand[0], runCommand.slice(1));
  } catch (error) {
    throw `Failed to run command \`${runCommand.join(" ")}\`:\n\n${chalk.red(error.message)}`;
  }

  return `Ran command: ${chalk.cyan(command.join(" "))}`;
}

/**
 * This action runs the install command. It optionally takes a `packageManager` configuration
 * option, but if omitted it will run against the detected package manager.
 */
export async function installPackages(_answers, { packageManager }) {
  let installCommand = packageManagerInstallCommand(packageManager);

  try {
    await execa(installCommand[0], installCommand.slice(1));
  } catch (error) {
    throw `Failed to install packages:\n\n${chalk.red(error.message)}`;
  }

  return `Installed packages`;
}
