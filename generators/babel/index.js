const Generator = require('yeoman-generator');

module.exports = class BabelGenerator extends Generator {

  // Override the default Yeoman installation any only use Yarn.
  install() {
    this.yarnInstall([
      "@babel/cli",
      "@babel/core",
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-decorators",
      "@babel/preset-env",
      "@babel/register"
    ]);
  }

  writing() {
    this.fs.copy(
      this.templatePath('babelrc'),
      this.destinationPath('.babelrc')
    );
  }
};
