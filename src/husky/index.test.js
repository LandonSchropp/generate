import { initializeTestRepo, lastCommit, runGenerator } from "../../test/helpers.js";
import { execa } from "execa";
import { readJson } from "fs-extra/esm";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

describe("the husky generator", () => {
  describe("with all tooling installed in a React project", () => {
    let directory;

    beforeAll(async () => {
      directory = await initializeTestRepo();
      await writeFile(
        join(directory, "package.json"),
        JSON.stringify({
          name: "t",
          type: "module",
          scripts: {},
          devDependencies: {
            prettier: "*",
            typescript: "*",
            eslint: "*",
            vitest: "*",
            react: "*",
          },
        }) + "\n",
      );
      await writeFile(join(directory, ".prettierignore"), "pnpm-lock.yaml\n");
      await execa("pnpm", ["install", "--silent"], { cwd: directory });
      await execa("git", ["add", "package.json", "pnpm-lock.yaml", ".prettierignore"], {
        cwd: directory,
      });
      await execa("git", ["commit", "-q", "-m", "add package"], { cwd: directory });
      await runGenerator("husky", directory);
    }, 120000);

    it("writes a pre-commit script that runs lint-staged", async () => {
      expect(await readFile(join(directory, ".husky/pre-commit"), "utf8")).toContain("lint-staged");
    });

    it("writes a .lintstagedrc.json with a prettier entry", async () => {
      let config = await readJson(join(directory, ".lintstagedrc.json"));
      expect(config["*"]).toContain("prettier");
    });

    it("writes a .lintstagedrc.json with an eslint entry", async () => {
      let config = await readJson(join(directory, ".lintstagedrc.json"));
      let eslintKey = Object.keys(config).find((key) => config[key] === "eslint");
      expect(eslintKey).toMatch(/tsx/);
    });

    it("adds a prepare script to package.json", async () => {
      let packageJson = await readJson(join(directory, "package.json"));
      expect(packageJson.scripts.prepare).toBe("husky");
    });

    it("commits the changes with 'Set up Husky'", async () => {
      expect((await lastCommit(directory)).subject).toBe("Set up Husky");
    });
  });
});
