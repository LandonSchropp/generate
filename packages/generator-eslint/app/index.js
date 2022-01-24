const Generator = require("yeoman-generator");

module.exports = class ESLintGenerator extends Generator {

  async prompting() {
    Object.assign(this, await this.prompt([
      {
        type: "confirm",
        name: "browser",
        message: "Is this a browser project?"
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
      "@landonschropp/eslint-config",
      "@babel/eslint-parser"
    ]);

    if (this.react) {
      await this.addDevDependencies([
        "@babel/eslint-parser",
        "eslint-plugin-react",
        "eslint-plugin-react-hooks"
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
