import { initializeTestRepo, lastCommit, runGenerator } from "../../test/helpers.js";
import { execa } from "execa";
import { readJson } from "fs-extra/esm";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

async function setUpRepo() {
  let directory = await initializeTestRepo();
  await writeFile(
    join(directory, "package.json"),
    JSON.stringify({ name: "t", type: "module", scripts: {} }) + "\n",
  );
  await execa("git", ["add", "package.json"], { cwd: directory });
  await execa("git", ["commit", "-q", "-m", "add package"], { cwd: directory });
  return directory;
}

describe("the bun-test generator", () => {
  let directory;

  beforeAll(async () => {
    directory = await setUpRepo();
    await runGenerator("bun-test", directory);
  }, 60000);

  it("creates bunfig.toml", async () => {
    expect(await readFile(join(directory, "bunfig.toml"), "utf8")).toBeTruthy();
  });

  it("creates test/setup.ts", async () => {
    expect(await readFile(join(directory, "test/setup.ts"), "utf8")).toBeTruthy();
  });

  it("appends coverage to .gitignore", async () => {
    let contents = await readFile(join(directory, ".gitignore"), "utf8");
    expect(contents).toContain("coverage");
  });

  it("adds a test script to package.json", async () => {
    let packageJson = await readJson(join(directory, "package.json"));
    expect(packageJson.scripts.test).toBe("bun test");
  });

  it("commits with 'Set up bun test'", async () => {
    expect((await lastCommit(directory)).subject).toBe("Set up bun test");
  });

  it("includes all generated files in the commit", async () => {
    expect((await lastCommit(directory)).files).toEqual(
      [".gitignore", "bunfig.toml", "package.json", "test/setup.ts"].sort(),
    );
  });
});
