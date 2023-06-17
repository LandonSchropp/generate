const _ = require("lodash");
const Generator = require("yeoman-generator");
const { basename } = require("path");

module.exports = class InitGenerator extends Generator {

  constructor(...parameters) {
    super(...parameters);
    this.env.options.nodePackageManager = "yarn";
  }

  async prompting() {
    const directory = basename(this.contextRoot);

    Object.assign(this, await this.prompt([
      {
        type: "input",
        name: "name",
        message: "What's the name of the package?",
        default: directory
      },
      {
        type: "input",
        name: "description",
        message: "How would you describe the package?"
      },
      {
        type: "confirm",
        name: "repository",
        message: "Would you like to include a Git repository under your GitHub username?",
        default: true
      },
      {
        type: "confirm",
        name: "author",
        message: "Would you like to set the author to yourself?",
        default: true
      },
      {
        type: "input",
        name: "version",
        message: "What would you like the version to be? (Leave blank to exclude.)"
      },
      {
        type: "confirm",
        name: "private",
        message: "Should this package be private?",
        default: false
      },
      {
        type: "confirm",
        name: "modules",
        message: "Would you like to use ES modules?",
        default: true
      },
      {
        type: "list",
        name: "license",
        message: "What license would you like to use?",
        default: "UNLICENSED",
        choices: [
          {
            name: "Unlicensed",
            value: "UNLICENSED"
          },
          {
            name: "MIT",
            value: "MIT"
          }
        ]
      }
    ]));
  }

  async writing() {
    let packageConfiguration = _.omitBy({
      "name": this.name,
      "description": this.description,
      "repository": this.repository
        ? `https://github.com/${ await this.user.github.username() }/${ this.name }`
        : null,
      "author": this.author ? `${ this.user.git.name() } <${ this.user.git.email() }>` : null,
      "license": this.license,
      "private": this.private ? true : null,
      "version": this.version ? this.version : null,
      "type": this.modules ? "module" : null
    }, _.isNil);

    this.fs.writeJSON(
      this.destinationPath("package.json"),
      packageConfiguration
    );

    this.fs.copyTpl(
      this.templatePath("gitignore"),
      this.destinationPath(".gitignore"),
      this
    );
  }

  end() {
    this.spawnCommandSync("git", [ "add", "package.json", "yarn.lock", ".gitignore" ]);
    this.spawnCommandSync("git", [ "commit", "-m", "Initial commit" ]);
  }
};
