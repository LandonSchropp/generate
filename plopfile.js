import installPackage from "./src/actions/install-package.js";

export default (plop) => {
  // Configuration
  plop.setWelcomeMessage("Landon Schropp's Generators");
  plop.setActionType("installPackage", installPackage);
};
