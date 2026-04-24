import { initializeTestRepo, lastCommit } from "../../test/helpers.js";
import { execa } from "execa";
import { readJson } from "fs-extra/esm";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

const BIN = join(import.meta.dirname, "..", "index.js");

describe("the only-allow generator", () => {
  let directory;

  beforeAll(async () => {
    directory = await initializeTestRepo();
    await writeFile(
      join(directory, "package.json"),
      JSON.stringify({ name: "t", type: "module", scripts: {} }) + "\n",
    );
    await execa("git", ["add", "package.json"], { cwd: directory });
    await execa("git", ["commit", "-q", "-m", "add package"], { cwd: directory });
    await execa(BIN, ["only-allow"], { cwd: directory });
  }, 60000);

  it("adds a preinstall script that invokes only-allow", async () => {
    let packageJson = await readJson(join(directory, "package.json"));
    expect(packageJson.scripts.preinstall).toContain("only-allow");
  });

  it("commits the change with 'Set up only-allow'", async () => {
    expect((await lastCommit(directory)).subject).toBe("Set up only-allow");
  });
});
