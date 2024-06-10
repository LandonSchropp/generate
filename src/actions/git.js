import chalk from "chalk";
import { execa } from "execa";

async function isWorkingDirectoryClean() {
  return (await execa("git", ["diff", "--quiet"], { reject: false })).exitCode === 0;
}

async function isStagingEmpty() {
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
  await execa("git", ["add", ...files]);
  await execa("git", ["commit", "--message", message]);

  return `Committed files: ${chalk.cyan(files.join(", "))}`;
}
