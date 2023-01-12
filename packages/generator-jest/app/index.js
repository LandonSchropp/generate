const Generator = require("yeoman-generator");

const BABEL_PARSER = "Babel";
const TYPESCRIPT_PARSER = "TypeScript";
const NONE_PARSER = "None";

module.exports = class JestGenerator extends Generator {

  async prompting() {
    Object.assign(this, await this.prompt([
      {
        type: "list",
        name: "parser",
        message: "Which parser would you like to use?",
        choices: [ BABEL_PARSER, TYPESCRIPT_PARSER, NONE_PARSER ]
      },
      {
        type: "confirm",
        name: "react",
        message: "Is this a React project?"
      }
    ]));
  }

  async install() {
    await this.addDevDependencies([
      "jest",
      "jest-dom",
      "jest-environment-jsdom",
      "jest-extended"
    ]);

    if (this.parser === BABEL_PARSER) {
      await this.addDevDependencies([ "babel-jest" ]);
    }

    if (this.parser === TYPESCRIPT_PARSER) {
      await this.addDevDependencies([ "ts-jest", "ts-node" ]);
    }

    if (this.react) {
      await this.addDevDependencies([ "@testing-library/dom", "@testing-library/jest-dom" ]);
    }
  }

  writing() {
    if (this.parser === TYPESCRIPT_PARSER) {
      this.fs.copyTpl(
        this.templatePath("jest.config.ts.ejs"),
        this.destinationPath("jest.config.ts"),
        this
      );

      this.fs.copyTpl(
        this.templatePath("jest.setup.js.ejs"),
        this.destinationPath("test/jest.setup.ts"),
        this
      );
    }
    else {
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
