import { initializeTestRepo } from "../test/helpers.js";
import { execa } from "execa";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

const BIN = join(import.meta.dirname, "index.js");

describe("generate", () => {
  describe("when called with --help", () => {
    let result;

    beforeEach(async () => {
      result = await execa(BIN, ["--help"]);
    });

    it("exits successfully", () => {
      expect(result.exitCode).toBe(0);
    });

    it("prints the plop usage", () => {
      expect(result.stdout).toContain("Usage:");
    });
  });

  describe("when called with an unknown generator", () => {
    let result;

    beforeEach(async () => {
      result = await execa(BIN, ["nonexistent"], { reject: false });
    });

    it("exits with a non-zero status code", () => {
      expect(result.exitCode).not.toBe(0);
    });

    it("prints a not-found message", () => {
      expect(result.stderr).toContain('Could not find a generator for "nonexistent"');
    });
  });

  describe("when called with a known generator", () => {
    let directory;

    beforeAll(async () => {
      directory = await initializeTestRepo();
      await writeFile(
        join(directory, "package.json"),
        JSON.stringify({ name: "t", type: "module", scripts: {} }) + "\n",
      );
      await execa("git", ["add", "package.json"], { cwd: directory });
      await execa("git", ["commit", "-q", "-m", "add package"], { cwd: directory });
      await execa(BIN, ["prettier"], { cwd: directory });
    }, 60000);

    it("runs the generator's actions", async () => {
      expect(await readFile(join(directory, ".prettierrc"), "utf8")).toContain("{");
    });

    it("commits the generator's changes", async () => {
      let { stdout } = await execa("git", ["log", "-1", "--pretty=%s"], { cwd: directory });
      expect(stdout).toBe("Set up Prettier");
    });
  });
});
