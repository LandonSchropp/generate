import { mergeJSON, writeJSON } from "./json.js";
import { readJson } from "fs-extra/esm";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

let directory;
let plop;

beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), "generate-json-"));
  plop = { getDestBasePath: () => directory };
});

describe("writeJSON", () => {
  describe("when the file does not exist", () => {
    beforeEach(async () => {
      await writeJSON(undefined, { path: "data.json", json: { name: "test" } }, plop);
    });

    it("writes the JSON to the path", async () => {
      expect(await readJson(join(directory, "data.json"))).toEqual({ name: "test" });
    });
  });

  describe("when the file already exists", () => {
    beforeEach(async () => {
      await writeFile(join(directory, "data.json"), JSON.stringify({ existing: true }));
      await writeJSON(undefined, { path: "data.json", json: { replaced: true } }, plop);
    });

    it("overwrites the file", async () => {
      expect(await readJson(join(directory, "data.json"))).toEqual({ replaced: true });
    });
  });
});

describe("mergeJSON", () => {
  describe("when the file does not exist", () => {
    beforeEach(async () => {
      await mergeJSON(undefined, { path: "data.json", json: { name: "test" } }, plop);
    });

    it("writes the JSON to the path", async () => {
      expect(await readJson(join(directory, "data.json"))).toEqual({ name: "test" });
    });
  });

  describe("when the file exists", () => {
    beforeEach(async () => {
      await writeFile(
        join(directory, "data.json"),
        JSON.stringify({ name: "old", scripts: { lint: "eslint" } }),
      );
      await mergeJSON(
        undefined,
        { path: "data.json", json: { scripts: { test: "vitest" }, version: "1.0.0" } },
        plop,
      );
    });

    it("preserves existing top-level keys not in the new JSON", async () => {
      expect((await readJson(join(directory, "data.json"))).name).toBe("old");
    });

    it("deep-merges nested keys", async () => {
      expect((await readJson(join(directory, "data.json"))).scripts).toEqual({
        lint: "eslint",
        test: "vitest",
      });
    });

    it("adds new top-level keys from the new JSON", async () => {
      expect((await readJson(join(directory, "data.json"))).version).toBe("1.0.0");
    });
  });
});
