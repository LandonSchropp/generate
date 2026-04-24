import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export function hasDependency(name, cwd = process.cwd()) {
  let packageJsonPath = join(cwd, "package.json");

  if (!existsSync(packageJsonPath)) {
    return false;
  }

  let { dependencies = {}, devDependencies = {} } = JSON.parse(
    readFileSync(packageJsonPath, "utf8"),
  );

  return name in dependencies || name in devDependencies;
}
