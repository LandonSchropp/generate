const Generator = require("yeoman-generator");

module.exports = class JestGenerator extends Generator {

  async prompting() {
    Object.assign(this, await this.prompt([
      {
        type: "confirm",
        name: "babel",
        message: "Would you like to use Babel with Jest?"
      },
      {
        type: "confirm",
        name: "react",
        message: "Is this a React project?"
      }
    ]));
  }

  async install() {
    await this.addDevDependencies([ "jest" ]);

    if (this.babel) {
      await this.addDevDependencies([ "babel-jest" ]);
    }

    if (this.react) {
      await this.addDevDependencies([ "@testing-library/dom", "@testing-library/jest-dom" ]);
    }
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("jest.config.js.ejs"),
      this.destinationPath("jest.config.js"),
      this
    );

    this.fs.copyTpl(
      this.templatePath("jest.setup.js.ejs"),
      this.destinationPath("test/jest.setup.js"),
      this
    );
  }

  end() {
    this.spawnCommandSync("git", [
      "add",
      "package.json",
      "yarn.lock",
      "jest.config.js",
      "test/jest.setup.js"
    ]);

    this.spawnCommandSync("git", [ "commit", "-m", "Add Jest" ]);
  }
};
