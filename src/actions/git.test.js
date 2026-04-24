import { commitFile, initializeTestRepo, lastCommit, stageFile } from "../../test/helpers.js";
import {
  gitCommit,
  gitInit,
  gitSafetyCheck,
  isStagingEmpty,
  isWorkingDirectoryClean,
} from "./git.js";
import { execa } from "execa";
import { pathExists } from "fs-extra";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

let directory;

beforeEach(async () => {
  directory = await initializeTestRepo();
  vi.spyOn(process, "cwd").mockReturnValue(directory);
});

describe("gitInit", () => {
  describe("when no Git repository exists in the current directory", () => {
    beforeEach(async () => {
      directory = await mkdtemp(join(tmpdir(), "generate-no-git-"));
      vi.mocked(process.cwd).mockReturnValue(directory);
    });

    it("creates a .git directory", async () => {
      await gitInit();
      expect(await pathExists(join(directory, ".git"))).toBe(true);
    });

    it("returns an 'initialized' message", async () => {
      expect(await gitInit()).toContain("Initialized");
    });
  });

  describe("when a Git repository already exists", () => {
    it("returns an 'already initialized' message", async () => {
      expect(await gitInit()).toContain("already");
    });

    it("does not change the current HEAD", async () => {
      let before = await execa("git", ["rev-parse", "HEAD"], { cwd: directory });
      await gitInit();
      let after = await execa("git", ["rev-parse", "HEAD"], { cwd: directory });
      expect(after.stdout).toBe(before.stdout);
    });
  });
});

describe("isWorkingDirectoryClean", () => {
  describe("when there are no changes", () => {
    it("returns true", async () => {
      expect(await isWorkingDirectoryClean()).toBe(true);
    });
  });

  describe("when a tracked file has unstaged modifications", () => {
    beforeEach(async () => {
      await commitFile(directory, "file.txt", "original");
      await writeFile(join(directory, "file.txt"), "modified");
    });

    it("returns false", async () => {
      expect(await isWorkingDirectoryClean()).toBe(false);
    });
  });
});

describe("isStagingEmpty", () => {
  describe("when nothing is staged", () => {
    it("returns true", async () => {
      expect(await isStagingEmpty()).toBe(true);
    });
  });

  describe("when a file is staged", () => {
    beforeEach(async () => {
      await stageFile(directory, "file.txt", "hello");
    });

    it("returns false", async () => {
      expect(await isStagingEmpty()).toBe(false);
    });
  });
});

describe("gitSafetyCheck", () => {
  describe("when the working directory is clean and staging is empty", () => {
    it("returns a success message", async () => {
      expect(await gitSafetyCheck()).toContain("clean");
    });
  });

  describe("when the working directory has unstaged changes", () => {
    beforeEach(async () => {
      await commitFile(directory, "file.txt", "original");
      await writeFile(join(directory, "file.txt"), "modified");
    });

    it("throws an error about the working directory", async () => {
      await expect(gitSafetyCheck()).rejects.toThrow("Working directory is not clean");
    });
  });

  describe("when the staging area has staged files", () => {
    beforeEach(async () => {
      await stageFile(directory, "file.txt", "hello");
    });

    it("throws an error about the staging area", async () => {
      await expect(gitSafetyCheck()).rejects.toThrow("Staging area is not empty");
    });
  });
});

describe("gitCommit", () => {
  describe("when all of the given files exist", () => {
    beforeEach(async () => {
      await writeFile(join(directory, "a.txt"), "a");
      await writeFile(join(directory, "b.txt"), "b");
      await gitCommit(undefined, { files: ["a.txt", "b.txt"], message: "Add files" });
    });

    it("creates a commit with the given message", async () => {
      expect((await lastCommit(directory)).subject).toBe("Add files");
    });

    it("stages the given files", async () => {
      expect((await lastCommit(directory)).files).toEqual(["a.txt", "b.txt"]);
    });
  });

  describe("when some of the given files do not exist", () => {
    beforeEach(async () => {
      await writeFile(join(directory, "a.txt"), "a");
      await gitCommit(undefined, { files: ["a.txt", "missing.txt"], message: "Partial" });
    });

    it("creates a commit with the given message", async () => {
      expect((await lastCommit(directory)).subject).toBe("Partial");
    });

    it("stages only the files that exist", async () => {
      expect((await lastCommit(directory)).files).toEqual(["a.txt"]);
    });
  });
});
