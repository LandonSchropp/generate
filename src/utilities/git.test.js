import { getGitHubUsername, getGitUserEmail, getGitUserName } from "./git.js";
import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("execa", () => ({ execa: vi.fn() }));

describe("getGitHubUsername", () => {
  describe("when gh returns a username", () => {
    beforeEach(() => {
      vi.mocked(execa).mockResolvedValue({ stdout: "landon" });
    });

    it("returns the username", async () => {
      expect(await getGitHubUsername()).toBe("landon");
    });
  });

  describe("when gh returns an empty string", () => {
    beforeEach(() => {
      vi.mocked(execa).mockResolvedValue({ stdout: "" });
    });

    it("returns null", async () => {
      expect(await getGitHubUsername()).toBeNull();
    });
  });
});

describe("getGitUserName", () => {
  describe("when git config has a user name", () => {
    beforeEach(() => {
      vi.mocked(execa).mockResolvedValue({ stdout: "Landon Schropp" });
    });

    it("returns the user name", async () => {
      expect(await getGitUserName()).toBe("Landon Schropp");
    });
  });

  describe("when git config has no user name", () => {
    beforeEach(() => {
      vi.mocked(execa).mockResolvedValue({ stdout: "" });
    });

    it("returns null", async () => {
      expect(await getGitUserName()).toBeNull();
    });
  });
});

describe("getGitUserEmail", () => {
  describe("when git config has a user email", () => {
    beforeEach(() => {
      vi.mocked(execa).mockResolvedValue({ stdout: "landon@example.com" });
    });

    it("returns the user email", async () => {
      expect(await getGitUserEmail()).toBe("landon@example.com");
    });
  });

  describe("when git config has no user email", () => {
    beforeEach(() => {
      vi.mocked(execa).mockResolvedValue({ stdout: "" });
    });

    it("returns null", async () => {
      expect(await getGitUserEmail()).toBeNull();
    });
  });
});
