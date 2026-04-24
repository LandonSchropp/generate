import { initializeTestRepo } from "../../test/helpers.js";
import { getGitUserEmail, getGitUserName } from "./git.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

let directory;

beforeEach(async () => {
  directory = await initializeTestRepo();
  vi.spyOn(process, "cwd").mockReturnValue(directory);
});

describe("getGitUserName", () => {
  it("returns the configured git user name", async () => {
    expect(await getGitUserName()).toBe("Test");
  });
});

describe("getGitUserEmail", () => {
  it("returns the configured git user email", async () => {
    expect(await getGitUserEmail()).toBe("test@example.com");
  });
});
