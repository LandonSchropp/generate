import { execa } from "execa";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BIN = join(import.meta.dirname, "..", "src", "index.js");

export async function runGenerator(generator, directory, flags = {}) {
  let args = [generator];

  for (let [key, value] of Object.entries(flags)) {
    args.push(`--${key}`, String(value));
  }

  return execa(BIN, args, { cwd: directory });
}

export async function initializeTestRepo() {
  let directory = await mkdtemp(join(tmpdir(), "generate-"));

  await execa("git", ["init", "-q"], { cwd: directory });
  await execa("git", ["config", "user.email", "test@example.com"], { cwd: directory });
  await execa("git", ["config", "user.name", "Test"], { cwd: directory });
  await execa("git", ["commit", "--allow-empty", "-q", "-m", "init"], { cwd: directory });

  return directory;
}

export async function commitFile(directory, name, contents) {
  await writeFile(join(directory, name), contents);
  await execa("git", ["add", name], { cwd: directory });
  await execa("git", ["commit", "-q", "-m", `add ${name}`], { cwd: directory });
}

export async function stageFile(directory, name, contents) {
  await writeFile(join(directory, name), contents);
  await execa("git", ["add", name], { cwd: directory });
}

export async function lastCommit(directory) {
  let { stdout: subject } = await execa("git", ["log", "-1", "--pretty=%s"], { cwd: directory });
  let { stdout: fileOutput } = await execa("git", ["show", "--name-only", "--pretty=", "HEAD"], {
    cwd: directory,
  });
  let files = fileOutput.split("\n").filter(Boolean).sort();

  return { subject, files };
}
