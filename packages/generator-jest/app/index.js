const Generator = require("yeoman-generator");

module.exports = class JestGenerator extends Generator {
  get packageJson() {
    return this.fs.readJSON(this.destinationPath("package.json"));
  }

  get dependencies() {
    return {
      ...(this.pacckageJson?.dependencies ?? {}),
      ...(this.pacckageJson?.devDependencies ?? {}),
    };
  }

  get isReactProject() {
    return !!this.dependencies.react;
  }

  get isTypeScriptProject() {
    return !!this.dependencies.typescript;
  }

  async install() {
    await this.addDevDependencies(["jest", "jest-dom", "jest-environment-jsdom", "jest-extended"]);

    if (this.isTypeScriptProject) {
      await this.addDevDependencies(["ts-jest", "ts-node"]);
    }

    if (this.isReactProject) {
      await this.addDevDependencies(["@testing-library/dom", "@testing-library/jest-dom"]);
    }
  }

  writing() {
    if (this.isTypeScriptProject) {
      this.fs.copyTpl(
        this.templatePath("jest.config.ts.ejs"),
        this.destinationPath("jest.config.ts"),
        this,
      );

      this.fs.copyTpl(
        this.templatePath("jest.setup.ts.ejs"),
        this.destinationPath("test/jest.setup.ts"),
        this,
      );
    } else {
      this.fs.copyTpl(
        this.templatePath("jest.config.js.ejs"),
        this.destinationPath("jest.config.js"),
        this,
      );

      this.fs.copyTpl(
        this.templatePath("jest.setup.js.ejs"),
        this.destinationPath("test/jest.setup.js"),
        this,
      );
    }
  }

  end() {
    this.spawnCommandSync("git", [
      "add",
      "package.json",
      "yarn.lock",
      "jest.config.*",
      "test/jest.setup.*",
    ]);

    this.spawnCommandSync("git", ["commit", "-m", "Add Jest"]);
  }
};
