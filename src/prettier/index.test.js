import { initializeTestRepo, lastCommit, runGenerator } from "../../test/helpers.js";
import { execa } from "execa";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

describe("the prettier generator", () => {
  let directory;

  beforeAll(async () => {
    directory = await initializeTestRepo();
    await writeFile(
      join(directory, "package.json"),
      JSON.stringify({ name: "t", type: "module", scripts: {} }) + "\n",
    );
    await execa("git", ["add", "package.json"], { cwd: directory });
    await execa("git", ["commit", "-q", "-m", "add package"], { cwd: directory });
    await runGenerator("prettier", directory);
  }, 60000);

  it("writes a .prettierrc", async () => {
    expect(await readFile(join(directory, ".prettierrc"), "utf8")).toContain("{");
  });

  it("writes a .prettierignore", async () => {
    expect((await readFile(join(directory, ".prettierignore"), "utf8")).length).toBeGreaterThan(0);
  });

  it("commits the changes with 'Set up Prettier'", async () => {
    expect((await lastCommit(directory)).subject).toBe("Set up Prettier");
  });
});
