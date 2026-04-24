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
  await writeFile(join(directory, "pnpm-lock.yaml"), "");
  await execa("git", ["add", "package.json"], { cwd: directory });
  await execa("git", ["commit", "-q", "-m", "add package"], { cwd: directory });
  return directory;
}

describe("the eslint generator", () => {
  describe("with the typescript plugin and node globals", () => {
    let directory;

    beforeAll(async () => {
      directory = await setupRepo();
      await runGenerator("eslint", directory, {
        typescript: true,
        react: false,
        vitest: false,
        globals: "node",
      });
    }, 120000);

    it("writes an eslint.config.js that imports typescript-eslint", async () => {
      expect(await readFile(join(directory, "eslint.config.js"), "utf8")).toContain(
        "typescript-eslint",
      );
    });

    it("writes an eslint.config.js that uses node globals", async () => {
      expect(await readFile(join(directory, "eslint.config.js"), "utf8")).toContain("globals.node");
    });

    it("adds a lint script to package.json", async () => {
      let packageJson = await readJson(join(directory, "package.json"));
      expect(packageJson.scripts.lint).toBe("eslint .");
    });

    it("commits the changes with 'Set up ESLint'", async () => {
      expect((await lastCommit(directory)).subject).toBe("Set up ESLint");
    });
  });

  describe("with the react plugin and browser globals", () => {
    let directory;

    beforeAll(async () => {
      directory = await setupRepo();
      await runGenerator("eslint", directory, {
        typescript: false,
        react: true,
        vitest: false,
        globals: "browser",
      });
    }, 120000);

    it("writes an eslint.config.js that imports eslint-plugin-react", async () => {
      expect(await readFile(join(directory, "eslint.config.js"), "utf8")).toContain(
        "eslint-plugin-react",
      );
    });

    it("writes an eslint.config.js that uses browser globals", async () => {
      expect(await readFile(join(directory, "eslint.config.js"), "utf8")).toContain(
        "globals.browser",
      );
    });
  });
});
