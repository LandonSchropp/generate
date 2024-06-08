import { getDestinationPath } from "../utilities/plop.js";
import { readJson, writeJson } from "fs-extra/esm";
import { mergeDeep } from "remeda";

/**
 * Safely reads JSON from the provided file. If the file does not exist or the JSON is invalid, an
 * empty object is returned.
 */
async function safeReadJson(path) {
  try {
    return await readJson(path);
  } catch {
    return {};
  }
}

/**
 * This action is like append, but instead reads the provided file as JSON, deep merges it with the
 * provided data, and the writes the result. If the file does not exist, the provided data is
 * written to it.
 */
export async function mergeJSON(_answers, config, plop) {
  let destinationPath = getDestinationPath(config, plop);
  let json = mergeDeep(await safeReadJson(destinationPath), config.data);

  await writeJson(destinationPath, json, { spaces: 2 });
}
