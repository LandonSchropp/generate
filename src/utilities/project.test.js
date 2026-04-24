import { hasDependency } from "./project.js";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("hasDependency", () => {
  let directory;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), "generate-project-"));
    vi.spyOn(process, "cwd").mockReturnValue(directory);
  });

  describe("when package.json does not exist", () => {
    it("returns false", () => {
      expect(hasDependency("react")).toBe(false);
    });
  });

  describe("when the dependency is listed under dependencies", () => {
    beforeEach(async () => {
      await writeFile(
        join(directory, "package.json"),
        JSON.stringify({ dependencies: { react: "*" } }),
      );
    });

    it("returns true", () => {
      expect(hasDependency("react")).toBe(true);
    });
  });

  describe("when the dependency is listed under devDependencies", () => {
    beforeEach(async () => {
      await writeFile(
        join(directory, "package.json"),
        JSON.stringify({ devDependencies: { typescript: "*" } }),
      );
    });

    it("returns true", () => {
      expect(hasDependency("typescript")).toBe(true);
    });
  });

  describe("when the dependency is not listed", () => {
    beforeEach(async () => {
      await writeFile(
        join(directory, "package.json"),
        JSON.stringify({ dependencies: { react: "*" }, devDependencies: { typescript: "*" } }),
      );
    });

    it("returns false", () => {
      expect(hasDependency("vitest")).toBe(false);
    });
  });

  describe("when neither dependencies nor devDependencies is present", () => {
    beforeEach(async () => {
      await writeFile(join(directory, "package.json"), JSON.stringify({ name: "t" }));
    });

    it("returns false", () => {
      expect(hasDependency("react")).toBe(false);
    });
  });
});
