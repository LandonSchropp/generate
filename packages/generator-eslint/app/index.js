const Generator = require("yeoman-generator");

const BABEL_PARSER = "Babel";
const TYPESCRIPT_PARSER = "TypeScript";
const NONE_PARSER = "None";

module.exports = class ESLintGenerator extends Generator {

  async prompting() {
    Object.assign(this, await this.prompt([
      {
        type: "confirm",
        name: "browser",
        message: "Is this a browser project?"
      },
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
      "eslint",
      "eslint_d",
      "@landonschropp/eslint-config"
    ]);

    if (this.react) {
      await this.addDevDependencies([
        "@landonschropp/eslint-config-react",
        "eslint-plugin-react",
        "eslint-plugin-react-hooks"
      ]);
    }

    if (this.parser === BABEL_PARSER) {
      await this.addDevDependencies([ "@babel/eslint-parser" ]);
    }

    if (this.parser === TYPESCRIPT_PARSER) {
      await this.addDependencies([ "typescript" ]);
      await this.addDevDependencies([
        "@typescript-eslint/parser",
        "@typescript-eslint/eslint-plugin"
      ]);
    }
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("eslintrc.js.ejs"),
      this.destinationPath(".eslintrc.js"),
      this
    );

    this.fs.copy(
      this.templatePath("eslintignore"),
      this.destinationPath(".eslintignore")
    );

    this.fs.extendJSON(
      this.destinationPath("package.json"),
      { scripts: { "lint": "eslint --max-warnings=0 ." } }
    );
  }

  end() {
    this.spawnCommandSync("git", [
      "add",
      ".eslintrc.js",
      ".eslintignore",
      "package.json",
      "yarn.lock"
    ]);

    this.spawnCommandSync("git", [ "commit", "-m", "Add ESLint" ]);
  }
};
