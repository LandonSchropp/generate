import { readJsonIfExists } from "../utilities/file.js";
import { getDestinationPath } from "../utilities/plop.js";
import { writeJson } from "fs-extra/esm";
import { mergeDeep } from "remeda";

/**
 * This action is like `add`, but instead of rendering a template, it writes the provided data to
 * the path as a JSON file.
 */
export async function writeJSON(_answers, config, plop) {
  let destinationPath = getDestinationPath(config, plop);
  await writeJson(destinationPath, config.json, { spaces: 2 });

  return `Wrote JSON to ${destinationPath}`;
}

/**
 * This action is like `append`, but instead reads the provided file as JSON, deep merges it with
 * the provided `json` config, and the writes the result. If the file does not exist, a new file is
 * create with the JSON.
 */
export async function mergeJSON(_answers, config, plop) {
  let destinationPath = getDestinationPath(config, plop);
  let json = mergeDeep((await readJsonIfExists(destinationPath)) ?? {}, config.json);

  await writeJson(destinationPath, json, { spaces: 2 });

  return `Merged JSON to ${destinationPath}`;
}
