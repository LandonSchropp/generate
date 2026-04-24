import { compact } from "./array.js";
import { describe, expect, it } from "vitest";

describe("compact", () => {
  describe("with an empty array", () => {
    it("returns an empty array", () => {
      expect(compact([])).toEqual([]);
    });
  });

  describe("with no null or undefined values", () => {
    it("returns the values unchanged", () => {
      expect(compact([1, 2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe("with null values", () => {
    it("removes them", () => {
      expect(compact([1, null, 2])).toEqual([1, 2]);
    });
  });

  describe("with undefined values", () => {
    it("removes them", () => {
      expect(compact([1, undefined, 2])).toEqual([1, 2]);
    });
  });

  describe("with other falsy values", () => {
    it("preserves 0, empty strings, and false", () => {
      expect(compact([0, "", false])).toEqual([0, "", false]);
    });
  });
});
