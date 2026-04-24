import { readJsonIfExists } from "./file.js";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

let directory;

beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), "generate-file-"));
});

describe("readJsonIfExists", () => {
  describe("when the file exists", () => {
    let path;

    beforeEach(async () => {
      path = join(directory, "data.json");
      await writeFile(path, JSON.stringify({ name: "test" }));
    });

    it("returns the parsed JSON", async () => {
      expect(await readJsonIfExists(path)).toEqual({ name: "test" });
    });
  });

  describe("when the file does not exist", () => {
    it("returns undefined", async () => {
      expect(await readJsonIfExists(join(directory, "missing.json"))).toBeUndefined();
    });
  });
});
