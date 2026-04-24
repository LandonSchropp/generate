import { addPackages, executeWithPackageManager, installPackages } from "./package-manager.js";
import { execa } from "execa";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("execa", () => ({ execa: vi.fn() }));

let directory;

beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), "generate-pm-action-"));
  vi.spyOn(process, "cwd").mockReturnValue(directory);
  vi.mocked(execa).mockResolvedValue({});
});

describe("addPackages", () => {
  describe("with a pnpm lockfile", () => {
    beforeEach(async () => {
      await writeFile(join(directory, "pnpm-lock.yaml"), "");
    });

    describe("with a regular dependency", () => {
      beforeEach(async () => {
        await addPackages(undefined, { packages: [{ name: "chalk" }] });
      });

      it("runs pnpm add with the package name", () => {
        expect(execa).toHaveBeenCalledWith("pnpm", ["add", "chalk"]);
      });
    });

    describe("with a dev dependency", () => {
      beforeEach(async () => {
        await addPackages(undefined, { packages: [{ name: "vitest", dev: true }] });
      });

      it("runs pnpm add with --save-dev", () => {
        expect(execa).toHaveBeenCalledWith("pnpm", ["add", "--save-dev", "vitest"]);
      });
    });

    describe("with both regular and dev dependencies", () => {
      beforeEach(async () => {
        await addPackages(undefined, {
          packages: [{ name: "chalk" }, { name: "vitest", dev: true }],
        });
      });

      it("adds regular dependencies first", () => {
        expect(execa).toHaveBeenNthCalledWith(1, "pnpm", ["add", "chalk"]);
      });

      it("adds dev dependencies second", () => {
        expect(execa).toHaveBeenNthCalledWith(2, "pnpm", ["add", "--save-dev", "vitest"]);
      });
    });

    describe("with no packages", () => {
      beforeEach(async () => {
        await addPackages(undefined, { packages: [] });
      });

      it("does not invoke execa", () => {
        expect(execa).not.toHaveBeenCalled();
      });
    });
  });

  describe("with a yarn lockfile", () => {
    beforeEach(async () => {
      await writeFile(join(directory, "yarn.lock"), "");
      await addPackages(undefined, {
        packages: [{ name: "chalk" }, { name: "vitest", dev: true }],
      });
    });

    it("adds regular dependencies with yarn add", () => {
      expect(execa).toHaveBeenCalledWith("yarn", ["add", "chalk"]);
    });

    it("adds dev dependencies with --dev", () => {
      expect(execa).toHaveBeenCalledWith("yarn", ["add", "--dev", "vitest"]);
    });
  });

  describe("with a bun lockfile", () => {
    beforeEach(async () => {
      await writeFile(join(directory, "bun.lock"), "");
      await addPackages(undefined, {
        packages: [{ name: "chalk" }, { name: "vitest", dev: true }],
      });
    });

    it("adds regular dependencies with bun install", () => {
      expect(execa).toHaveBeenCalledWith("bun", ["install", "chalk"]);
    });

    it("adds dev dependencies with --save-dev", () => {
      expect(execa).toHaveBeenCalledWith("bun", ["install", "--save-dev", "vitest"]);
    });
  });

  describe("with no lockfile", () => {
    beforeEach(async () => {
      await addPackages(undefined, {
        packages: [{ name: "chalk" }, { name: "vitest", dev: true }],
      });
    });

    it("adds regular dependencies with npm install --save", () => {
      expect(execa).toHaveBeenCalledWith("npm", ["install", "--save", "chalk"]);
    });

    it("adds dev dependencies with npm install --save-dev", () => {
      expect(execa).toHaveBeenCalledWith("npm", ["install", "--save-dev", "vitest"]);
    });
  });
});

describe("executeWithPackageManager", () => {
  beforeEach(async () => {
    await writeFile(join(directory, "pnpm-lock.yaml"), "");
  });

  describe("with a string command", () => {
    beforeEach(async () => {
      await executeWithPackageManager(undefined, { command: "husky install" });
    });

    it("splits the command on whitespace", () => {
      expect(execa).toHaveBeenCalledWith("pnpm", ["exec", "husky", "install"]);
    });
  });

  describe("with an array command", () => {
    beforeEach(async () => {
      await executeWithPackageManager(undefined, { command: ["husky", "install"] });
    });

    it("passes the array through to the run command", () => {
      expect(execa).toHaveBeenCalledWith("pnpm", ["exec", "husky", "install"]);
    });
  });
});

describe("installPackages", () => {
  describe("with an explicit package manager", () => {
    beforeEach(async () => {
      await installPackages(undefined, { packageManager: "yarn" });
    });

    it("uses that manager's install command", () => {
      expect(execa).toHaveBeenCalledWith("yarn", ["install"]);
    });
  });

  describe("without an explicit package manager", () => {
    beforeEach(async () => {
      await writeFile(join(directory, "bun.lock"), "");
      await installPackages(undefined, {});
    });

    it("detects the manager from the lockfile and installs", () => {
      expect(execa).toHaveBeenCalledWith("bun", ["install"]);
    });
  });
});
