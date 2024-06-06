import { humanizeList } from "../utilities/array";
import { execa } from "execa";
import { pathExists } from "fs-extra";

export default async (_answers, { packages }) => {
  if (!(await pathExists("pnpm-lock.yaml"))) {
    throw "The addPackages action currently only works with pnpm.";
  }

  let regularNames = packages.filter(({ dev }) => !dev).map(({ name }) => name);
  let devNames = packages.filter(({ dev }) => dev).map(({ name }) => name);
  let names = packages.map(({ name }) => name);

  if (regularNames.length > 0) {
    try {
      await execa("pnpm", ["add", ...regularNames]);
    } catch (error) {
      throw `Failed to add packages ${humanizeList(regularNames)}:\n\n${error.message}`;
    }
  }

  if (devNames.length > 0) {
    try {
      await execa("pnpm", ["add", "--save-dev", ...devNames]);
    } catch (error) {
      throw `Failed to add dev packages ${humanizeList(devNames)}:\n\n${error.message}`;
    }
  }

  return `Added ${humanizeList(names)}`;
};
