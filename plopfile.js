import addPackages from "./src/actions/add-packages.js";
import eslint from "./src/eslint/index.js";
import prettier from "./src/prettier/index.js";
import typescript from "./src/typescript/index.js";

export default (plop) => {
  // Configuration
  plop.setWelcomeMessage("Landon Schropp's Generators");
  plop.setActionType("addPackages", addPackages);

  // Generators
  prettier(plop);
  eslint(plop);
  typescript(plop);
};
