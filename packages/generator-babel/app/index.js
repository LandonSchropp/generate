const Generator = require("yeoman-generator");

module.exports = class BabelGenerator extends Generator {

  async prompting() {
    Object.assign(this, await this.prompt([
      {
        type: "confirm",
        name: "react",
        message: "Is this a React project?"
      }
    ]));
  }

  async install() {
    await this.addDependencies([
      "@babel/cli",
      "@babel/core",
      "@babel/node",
      "@babel/preset-env",
      "@babel/register"
    ]);

    if (this.react) {
      await this.addDependencies([ "babel-preset-react-app" ]);
    }
  }

  writing() {
    let babelConfiguration = {
      "presets": [ this.react ? "babel-preset-react-app" : "@babel/preset-env" ]
    };

    this.fs.writeJSON(
      this.destinationPath(".babelrc"),
      babelConfiguration
    );
  }

  end() {
    this.spawnCommandSync("git", [ "add", ".babelrc", "package.json", "yarn.lock" ]);
    this.spawnCommandSync("git", [ "commit", "-m", "Add Babel" ]);
  }
};
