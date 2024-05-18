import installPackage from "./src/actions/install-package.js";
import prettier from "./src/prettier/index.js";

export default (plop) => {
  // Configuration
  plop.setWelcomeMessage("Landon Schropp's Generators");
  plop.setActionType("installPackage", installPackage);

  // Generators
  prettier(plop);
};
