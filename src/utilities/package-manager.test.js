import {
  detectPackageManager,
  findPackageManager,
  packageManagerInstallCommand,
  packageManagerLockFile,
  packageManagerRunCommand,
} from "./package-manager.js";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("detectPackageManager", () => {
  let directory;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), "generate-pm-"));
    vi.spyOn(process, "cwd").mockReturnValue(directory);
  });

  describe("when yarn.lock exists", () => {
    beforeEach(async () => {
      await writeFile(join(directory, "yarn.lock"), "");
    });

    it("returns yarn", () => {
      expect(detectPackageManager()).toBe("yarn");
    });
  });

  describe("when pnpm-lock.yaml exists", () => {
    beforeEach(async () => {
      await writeFile(join(directory, "pnpm-lock.yaml"), "");
    });

    it("returns pnpm", () => {
      expect(detectPackageManager()).toBe("pnpm");
    });
  });

  describe("when bun.lock exists", () => {
    beforeEach(async () => {
      await writeFile(join(directory, "bun.lock"), "");
    });

    it("returns bun", () => {
      expect(detectPackageManager()).toBe("bun");
    });
  });

  describe("when package-lock.json exists", () => {
    beforeEach(async () => {
      await writeFile(join(directory, "package-lock.json"), "");
    });

    it("returns npm", () => {
      expect(detectPackageManager()).toBe("npm");
    });
  });

  describe("when no lockfile exists", () => {
    it("returns npm", () => {
      expect(detectPackageManager()).toBe("npm");
    });
  });
});

describe("findPackageManager", () => {
  let directory;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), "generate-pm-"));
    vi.spyOn(process, "cwd").mockReturnValue(directory);
  });

  describe("when yarn.lock exists", () => {
    beforeEach(async () => {
      await writeFile(join(directory, "yarn.lock"), "");
    });

    it("returns yarn", () => {
      expect(findPackageManager()).toBe("yarn");
    });
  });

  describe("when pnpm-lock.yaml exists", () => {
    beforeEach(async () => {
      await writeFile(join(directory, "pnpm-lock.yaml"), "");
    });

    it("returns pnpm", () => {
      expect(findPackageManager()).toBe("pnpm");
    });
  });

  describe("when bun.lock exists", () => {
    beforeEach(async () => {
      await writeFile(join(directory, "bun.lock"), "");
    });

    it("returns bun", () => {
      expect(findPackageManager()).toBe("bun");
    });
  });

  describe("when package-lock.json exists", () => {
    beforeEach(async () => {
      await writeFile(join(directory, "package-lock.json"), "");
    });

    it("returns npm", () => {
      expect(findPackageManager()).toBe("npm");
    });
  });

  describe("when no lockfile exists", () => {
    it("returns null", () => {
      expect(findPackageManager()).toBeNull();
    });
  });
});

describe("packageManagerRunCommand", () => {
  describe("with yarn", () => {
    it("returns the yarn exec command", () => {
      expect(packageManagerRunCommand("yarn")).toEqual(["yarn", "exec"]);
    });
  });

  describe("with pnpm", () => {
    it("returns the pnpm exec command", () => {
      expect(packageManagerRunCommand("pnpm")).toEqual(["pnpm", "exec"]);
    });
  });

  describe("with bun", () => {
    it("returns the bun run command", () => {
      expect(packageManagerRunCommand("bun")).toEqual(["bun", "run"]);
    });
  });

  describe("with npm", () => {
    it("returns the npm run command", () => {
      expect(packageManagerRunCommand("npm")).toEqual(["npm", "run"]);
    });
  });
});

describe("packageManagerInstallCommand", () => {
  describe("with yarn", () => {
    it("returns the yarn install command", () => {
      expect(packageManagerInstallCommand("yarn")).toEqual(["yarn", "install"]);
    });
  });

  describe("with pnpm", () => {
    it("returns the pnpm install command", () => {
      expect(packageManagerInstallCommand("pnpm")).toEqual(["pnpm", "install"]);
    });
  });

  describe("with bun", () => {
    it("returns the bun install command", () => {
      expect(packageManagerInstallCommand("bun")).toEqual(["bun", "install"]);
    });
  });

  describe("with npm", () => {
    it("returns the npm install command", () => {
      expect(packageManagerInstallCommand("npm")).toEqual(["npm", "install"]);
    });
  });
});

describe("packageManagerLockFile", () => {
  describe("with yarn", () => {
    it("returns yarn.lock", () => {
      expect(packageManagerLockFile("yarn")).toBe("yarn.lock");
    });
  });

  describe("with pnpm", () => {
    it("returns pnpm-lock.yaml", () => {
      expect(packageManagerLockFile("pnpm")).toBe("pnpm-lock.yaml");
    });
  });

  describe("with bun", () => {
    it("returns bun.lock", () => {
      expect(packageManagerLockFile("bun")).toBe("bun.lock");
    });
  });

  describe("with npm", () => {
    it("returns package-lock.json", () => {
      expect(packageManagerLockFile("npm")).toBe("package-lock.json");
    });
  });
});
