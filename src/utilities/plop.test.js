import { getDestinationPath } from "./plop.js";
import { describe, expect, it } from "vitest";

describe("getDestinationPath", () => {
  describe("with a relative config path", () => {
    it("resolves it relative to plop's destination base path", () => {
      let plop = { getDestBasePath: () => "/project" };
      expect(getDestinationPath({ path: "package.json" }, plop)).toBe("/project/package.json");
    });
  });

  describe("with an absolute config path", () => {
    it("returns the absolute path unchanged", () => {
      let plop = { getDestBasePath: () => "/project" };
      expect(getDestinationPath({ path: "/other/file.js" }, plop)).toBe("/other/file.js");
    });
  });
});
