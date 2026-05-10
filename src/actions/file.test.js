import { appendToFile } from "./file.js";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

let directory;
let plop;

beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), "generate-file-"));
  plop = { getDestBasePath: vi.fn().mockReturnValue(directory) };
});

describe("appendToFile", () => {
  describe("when the file does not exist", () => {
    beforeEach(async () => {
      await appendToFile(undefined, { path: ".gitignore", content: "coverage" }, plop);
    });

    it("creates the file with the content", async () => {
      expect(await readFile(join(directory, ".gitignore"), "utf8")).toBe("coverage\n");
    });
  });

  describe("when the file exists without the content", () => {
    beforeEach(async () => {
      await writeFile(join(directory, ".gitignore"), "node_modules\n");
      await appendToFile(undefined, { path: ".gitignore", content: "coverage" }, plop);
    });

    it("appends the content on a new line", async () => {
      expect(await readFile(join(directory, ".gitignore"), "utf8")).toBe(
        "node_modules\ncoverage\n",
      );
    });
  });

  describe("when the file exists and already contains the content as an exact line", () => {
    beforeEach(async () => {
      await writeFile(join(directory, ".gitignore"), "node_modules\ncoverage\n");
      await appendToFile(undefined, { path: ".gitignore", content: "coverage" }, plop);
    });

    it("does not duplicate the content", async () => {
      let contents = await readFile(join(directory, ".gitignore"), "utf8");
      expect(contents.split("coverage")).toHaveLength(2);
    });
  });

  describe("when the file contains the content as a substring of another line", () => {
    beforeEach(async () => {
      await writeFile(join(directory, ".gitignore"), "node_modules\ncoverage-reports\n");
      await appendToFile(undefined, { path: ".gitignore", content: "coverage" }, plop);
    });

    it("still appends the content", async () => {
      expect(await readFile(join(directory, ".gitignore"), "utf8")).toBe(
        "node_modules\ncoverage-reports\ncoverage\n",
      );
    });
  });

  describe("when the file exists without a trailing newline", () => {
    beforeEach(async () => {
      await writeFile(join(directory, ".gitignore"), "node_modules");
      await appendToFile(undefined, { path: ".gitignore", content: "coverage" }, plop);
    });

    it("adds a newline before the content", async () => {
      expect(await readFile(join(directory, ".gitignore"), "utf8")).toBe(
        "node_modules\ncoverage\n",
      );
    });
  });
});
