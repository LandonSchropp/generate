import { readJson, pathExists } from "fs-extra/esm";

export async function readJsonIfExists(path) {
  return (await pathExists(path)) ? await readJson(path) : undefined;
}
