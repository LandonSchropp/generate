import { initializeTestRepo, lastCommit, runGenerator } from "../../test/helpers.js";
import { execa } from "execa";
import { readJson } from "fs-extra/esm";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

async function setupRepo() {
  let directory = await initializeTestRepo();
  await writeFile(
    join(directory, "package.json"),
    JSON.stringify({ name: "t", type: "module", scripts: {} }) + "\n",
  );
  await execa("git", ["add", "package.json"], { cwd: directory });
  await execa("git", ["commit", "-q", "-m", "add package"], { cwd: directory });
  return directory;
}

describe("the vitest generator", () => {
  describe("with typescript and react", () => {
    let directory;

    beforeAll(async () => {
      directory = await setupRepo();
      await runGenerator("vitest", directory, { typescript: true, react: true });
    }, 60000);

    it("writes a vitest.config.ts with the jsdom environment", async () => {
      expect(await readFile(join(directory, "vitest.config.ts"), "utf8")).toContain(
        'environment: "jsdom"',
      );
    });

    it("wires jest-dom matchers via setupFiles", async () => {
      expect(await readFile(join(directory, "vitest.config.ts"), "utf8")).toContain(
        '"@testing-library/jest-dom/vitest"',
      );
    });

    it("adds a test script to package.json", async () => {
      let packageJson = await readJson(join(directory, "package.json"));
      expect(packageJson.scripts.test).toBe("vitest run");
    });

    it("commits with 'Set up Vitest'", async () => {
      expect((await lastCommit(directory)).subject).toBe("Set up Vitest");
    });
  });

  describe("with typescript but not react", () => {
    let directory;

    beforeAll(async () => {
      directory = await setupRepo();
      await runGenerator("vitest", directory, { typescript: true, react: false });
    }, 60000);

    it("writes a vitest.config.ts without the jsdom environment", async () => {
      expect(await readFile(join(directory, "vitest.config.ts"), "utf8")).not.toContain("jsdom");
    });
  });

  describe("without typescript", () => {
    let directory;

    beforeAll(async () => {
      directory = await setupRepo();
      await runGenerator("vitest", directory, { typescript: false, react: true });
    }, 60000);

    it("writes a vitest.config.js", async () => {
      expect(await readFile(join(directory, "vitest.config.js"), "utf8")).toBeTruthy();
    });
  });
});
