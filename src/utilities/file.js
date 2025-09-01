import { readJson, pathExists } from "fs-extra/esm";

export async function readJsonIfExists(path, fallback) {
  return (await pathExists(path)) ? await readJson(path) : fallback;
}
