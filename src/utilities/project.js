import { pathExistsSync, readJsonSync } from "fs-extra/esm";
import { join } from "node:path";

export function hasDependency(name, cwd = process.cwd()) {
  let packageJsonPath = join(cwd, "package.json");

  if (!pathExistsSync(packageJsonPath)) {
    return false;
  }

  let { dependencies = {}, devDependencies = {} } = readJsonSync(packageJsonPath);

  return name in dependencies || name in devDependencies;
}
