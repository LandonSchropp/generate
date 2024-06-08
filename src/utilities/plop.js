import path from "path";

/**
 * This function determines the destination path from the configuration and the provided data. It
 * uses the `path` property from the configuration.
 */
export const getDestinationPath = (config, plop) => {
  return path.resolve(plop.getDestBasePath(), config.path);
};
