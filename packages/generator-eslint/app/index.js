const Generator = require("yeoman-generator");

module.exports = class ESLintGenerator extends Generator {
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
    await this.addDevDependencies(["eslint", "eslint_d", "@landonschropp/eslint-config"]);

    if (this.isReactProject) {
      await this.addDevDependencies([
        "@landonschropp/eslint-config-react",
        "eslint-plugin-react",
        "eslint-plugin-react-hooks",
      ]);
    }

    if (this.isTypeScriptProject) {
      await this.addDependencies(["typescript"]);
      await this.addDevDependencies([
        "@typescript-eslint/parser",
        "@typescript-eslint/eslint-plugin",
      ]);
    }
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("eslintrc.js.ejs"),
      this.destinationPath(".eslintrc.js"),
      this,
    );

    this.fs.copy(this.templatePath("eslintignore"), this.destinationPath(".eslintignore"));

    this.fs.extendJSON(this.destinationPath("package.json"), {
      scripts: { lint: "eslint --max-warnings=0 ." },
    });
  }

  end() {
    this.spawnCommandSync("git", [
      "add",
      ".eslintrc.js",
      ".eslintignore",
      "package.json",
      "yarn.lock",
    ]);

    this.spawnCommandSync("git", ["commit", "-m", "Add ESLint"]);
  }
};
