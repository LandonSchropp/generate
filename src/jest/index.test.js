import { initializeTestRepo, lastCommit } from "../../test/helpers.js";
import { execa } from "execa";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

const BIN = join(import.meta.dirname, "..", "index.js");

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

describe("the jest generator", () => {
  describe("with typescript and react", () => {
    let directory;

    beforeAll(async () => {
      directory = await setupRepo();
      await execa(BIN, ["jest", "true", "true"], { cwd: directory });
    }, 60000);

    it("writes a jest.config.ts with the jsdom environment", async () => {
      expect(await readFile(join(directory, "jest.config.ts"), "utf8")).toContain(
        'testEnvironment: "jsdom"',
      );
    });

    it("writes a jest.setup.ts", async () => {
      expect(await readFile(join(directory, "jest.setup.ts"), "utf8")).toBeTruthy();
    });

    it("commits with 'Set up Jest'", async () => {
      expect((await lastCommit(directory)).subject).toBe("Set up Jest");
    });
  });

  describe("with typescript but not react", () => {
    let directory;

    beforeAll(async () => {
      directory = await setupRepo();
      await execa(BIN, ["jest", "true", "false"], { cwd: directory });
    }, 60000);

    it("writes a jest.config.ts without the jsdom environment", async () => {
      expect(await readFile(join(directory, "jest.config.ts"), "utf8")).not.toContain("jsdom");
    });
  });

  describe("without typescript", () => {
    let directory;
    let result;

    beforeAll(async () => {
      directory = await setupRepo();
      result = await execa(BIN, ["jest", "false", "false"], { cwd: directory, reject: false });
    }, 60000);

    it("exits with a non-zero status code", () => {
      expect(result.exitCode).not.toBe(0);
    });

    it("reports that TypeScript is required", () => {
      expect(result.stderr).toContain("TypeScript is currently required");
    });
  });
});
