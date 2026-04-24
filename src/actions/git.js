import { asyncFilter } from "../utilities/array.js";
import chalk from "chalk";
import { execa } from "execa";
import { pathExists } from "fs-extra";
import { join } from "node:path";

/** Initializes a new Git repository if one does not already exist in the current directory. */
export async function gitInit() {
  let cwd = process.cwd();

  if (await pathExists(join(cwd, ".git"))) {
    return "Git repository already initialized.";
  }

  await execa("git", ["init", "-q"], { cwd });

  return "Initialized Git repository.";
}

export async function isWorkingDirectoryClean() {
  return (await execa("git", ["diff", "--quiet"], { reject: false })).exitCode === 0;
}

export async function isStagingEmpty() {
  return (await execa("git", ["diff", "--cached", "--quiet"], { reject: false })).exitCode === 0;
}

/** Ensures that no files are currently staged and that the working directory is clean. */
export async function gitSafetyCheck() {
  if (!(await isWorkingDirectoryClean())) {
    throw new Error("Working directory is not clean.");
  }

  if (!(await isStagingEmpty())) {
    throw new Error("Staging area is not empty.");
  }

  return "Working directory is clean and staging area is empty.";
}

/** This action stages the provided files and commits them with the given message. */
export async function gitCommit(_answers, { files, message }) {
  let cwd = process.cwd();
  let existingFiles = await asyncFilter(files, (file) => pathExists(join(cwd, file)));

  await execa("git", ["add", ...existingFiles], { cwd });
  await execa("git", ["commit", "--message", message], { cwd });

  return `Committed files: ${chalk.cyan(existingFiles.join(", "))}`;
}
