import { execa } from "execa";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export async function initializeTestRepo() {
  let directory = await mkdtemp(join(tmpdir(), "generate-"));

  await execa("git", ["init", "-q"], { cwd: directory });
  await execa("git", ["config", "user.email", "test@example.com"], { cwd: directory });
  await execa("git", ["config", "user.name", "Test"], { cwd: directory });
  await execa("git", ["commit", "--allow-empty", "-q", "-m", "init"], { cwd: directory });

  return directory;
}
