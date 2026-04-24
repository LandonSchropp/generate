import { initializeTestRepo } from "../../test/helpers.js";
import { execa } from "execa";
import { readJson } from "fs-extra/esm";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

const BIN = join(import.meta.dirname, "..", "index.js");

describe("the initialize generator", () => {
  describe("when the package manager is pnpm", () => {
    let directory;

    beforeAll(async () => {
      directory = await initializeTestRepo();
      await execa(
        BIN,
        ["initialize", "my-project", "A test project", "", "", "MIT", "false", "true", "", "pnpm"],
        { cwd: directory },
      );
    }, 60000);

    it("writes a package.json with the given name", async () => {
      let packageJson = await readJson(join(directory, "package.json"));
      expect(packageJson.name).toBe("my-project");
    });

    it("writes a package.json with the given description", async () => {
      let packageJson = await readJson(join(directory, "package.json"));
      expect(packageJson.description).toBe("A test project");
    });

    it("writes a .gitignore containing node_modules", async () => {
      expect(await readFile(join(directory, ".gitignore"), "utf8")).toContain("node_modules");
    });

    it("writes a .node-version file with a major version", async () => {
      expect(await readFile(join(directory, ".node-version"), "utf8")).toMatch(/^\d+\s*$/);
    });

    it("commits the changes with 'Initialize package'", async () => {
      let { stdout } = await execa("git", ["log", "-1", "--pretty=%s"], { cwd: directory });
      expect(stdout).toBe("Initialize package");
    });
  });

  describe("when the package manager is bun", () => {
    let directory;

    beforeAll(async () => {
      directory = await initializeTestRepo();
      await execa(
        BIN,
        ["initialize", "my-project", "A test project", "", "", "MIT", "false", "true", "", "bun"],
        { cwd: directory },
      );
    }, 60000);

    it("does not write a .node-version file", async () => {
      await expect(readFile(join(directory, ".node-version"), "utf8")).rejects.toThrow();
    });

    it("commits the changes with 'Initialize package'", async () => {
      let { stdout } = await execa("git", ["log", "-1", "--pretty=%s"], { cwd: directory });
      expect(stdout).toBe("Initialize package");
    });
  });
});
