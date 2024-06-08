import { addPackages, executeWithPackageManager } from "./src/actions/package-manager.js";
import eslint from "./src/eslint/index.js";
import prettier from "./src/prettier/index.js";
import typescript from "./src/typescript/index.js";

export default (plop) => {
  // Configuration
  plop.setWelcomeMessage("Landon Schropp's Generators");
  plop.setActionType("addPackages", addPackages);
  plop.setActionType("executeWithPackageManager", executeWithPackageManager);

  // Generators
  prettier(plop);
  eslint(plop);
  typescript(plop);
};
