import { toTitleCase } from "./string.js";
import { describe, expect, it } from "vitest";

describe("toTitleCase", () => {
  describe("with a single lowercase word", () => {
    it("capitalizes the first letter", () => {
      expect(toTitleCase("prettier")).toBe("Prettier");
    });
  });

  describe("with a hyphenated name", () => {
    it("capitalizes the first letter of each segment and preserves the hyphen", () => {
      expect(toTitleCase("only-allow")).toBe("Only-Allow");
    });
  });

  describe("with an already-capitalized word", () => {
    it("leaves it unchanged", () => {
      expect(toTitleCase("Husky")).toBe("Husky");
    });
  });

  describe("with an empty string", () => {
    it("returns an empty string", () => {
      expect(toTitleCase("")).toBe("");
    });
  });
});
