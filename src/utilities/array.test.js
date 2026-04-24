import { asyncFilter, compact } from "./array.js";
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

describe("asyncFilter", () => {
  describe("with an empty array", () => {
    it("returns an empty array", async () => {
      expect(await asyncFilter([], async () => true)).toEqual([]);
    });
  });

  describe("when the predicate resolves true for all items", () => {
    it("returns every item", async () => {
      expect(await asyncFilter([1, 2, 3], async () => true)).toEqual([1, 2, 3]);
    });
  });

  describe("when the predicate resolves false for all items", () => {
    it("returns an empty array", async () => {
      expect(await asyncFilter([1, 2, 3], async () => false)).toEqual([]);
    });
  });

  describe("when the predicate resolves true for some items", () => {
    it("returns only the items where the predicate resolved true", async () => {
      expect(await asyncFilter([1, 2, 3, 4], async (value) => value % 2 === 0)).toEqual([2, 4]);
    });

    it("preserves the original order", async () => {
      expect(await asyncFilter(["b", "a", "c"], async (value) => value !== "a")).toEqual([
        "b",
        "c",
      ]);
    });
  });
});
