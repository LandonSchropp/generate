import { initializeTestRepo, lastCommit, runGenerator } from "../../test/helpers.js";
import { execa } from "execa";
import { readJson } from "fs-extra/esm";
import { writeFile } from "node:fs/promises";
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

describe("the typescript generator", () => {
  describe("with a node project and no outDir", () => {
    let directory;

    beforeAll(async () => {
      directory = await setupRepo();
      await runGenerator("typescript", directory, { type: "node", react: false, outDir: "" });
    }, 60000);

    it("writes a tsconfig.json with noEmit set", async () => {
      let tsconfig = await readJson(join(directory, "tsconfig.json"));
      expect(tsconfig.compilerOptions.noEmit).toBe(true);
    });

    it("adds a check-types script", async () => {
      let packageJson = await readJson(join(directory, "package.json"));
      expect(packageJson.scripts["check-types"]).toBe("tsc --noEmit");
    });

    it("does not add a build script", async () => {
      let packageJson = await readJson(join(directory, "package.json"));
      expect(packageJson.scripts.build).toBeUndefined();
    });

    it("commits with 'Set up TypeScript'", async () => {
      expect((await lastCommit(directory)).subject).toBe("Set up TypeScript");
    });
  });

  describe("with a node project and an outDir", () => {
    let directory;

    beforeAll(async () => {
      directory = await setupRepo();
      await runGenerator("typescript", directory, { type: "node", react: false, outDir: "dist" });
    }, 60000);

    it("writes a tsconfig.json with the given outDir", async () => {
      let tsconfig = await readJson(join(directory, "tsconfig.json"));
      expect(tsconfig.compilerOptions.outDir).toBe("dist");
    });

    it("writes a tsconfig.json without noEmit", async () => {
      let tsconfig = await readJson(join(directory, "tsconfig.json"));
      expect(tsconfig.compilerOptions.noEmit).toBeUndefined();
    });

    it("adds a build script", async () => {
      let packageJson = await readJson(join(directory, "package.json"));
      expect(packageJson.scripts.build).toBe("tsc");
    });
  });
});
