import { pathExists } from "fs-extra";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export async function appendToFile(_answers, { path, content }, plop) {
  let filePath = join(plop.getDestBasePath(), path);

  if (!(await pathExists(filePath))) {
    await writeFile(filePath, content + "\n");
    return `Appended to ${path}`;
  }

  let existing = await readFile(filePath, "utf8");

  if (existing.split("\n").some((line) => line === content)) {
    return `${path} already contains content, skipping`;
  }

  let separator = existing.endsWith("\n") ? "" : "\n";
  await writeFile(filePath, `${existing}${separator}${content}\n`);
  return `Appended to ${path}`;
}
