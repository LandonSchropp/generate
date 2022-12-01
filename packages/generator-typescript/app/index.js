const Generator = require("yeoman-generator");

module.exports = class TypeScriptGenerator extends Generator {

  async prompting() {
    Object.assign(this, await this.prompt([
      {
        type: "confirm",
        name: "react",
        message: "Is this a React project?"
      },
      {
        type: "input",
        name: "source",
        message: "What's the name of your source directory?",
        default: "source"
      }
    ]));
  }

  async install() {
    await this.addDependencies([ "typescript" ]);

    if (!this.react) {
      await this.addDevDependencies([ "@types/node" ]);
    }
  }

  writing() {
    let tsconfig = {
      compilerOptions: {
        target: "esnext",
        lib: [
          ...this.react ? [ "dom" ] : [],
          "esnext"
        ],
        ...this.react ? { jsx: "react" } : {},
        module: "esnext",
        moduleResolution: "node",
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        strict: true,
        skipLibCheck: true,
        allowJs: true,
        allowSyntheticDefaultImports: true,
        useDefineForClassFields: true,
        noUncheckedIndexedAccess: true,
        noEmit: true,
        incremental: true,
        resolveJsonModule: true,
        isolatedModules: true
      },
      include: [
        `./${ this.source }/**/*`,
        "./test/**/*"
      ],
      exclude: [
        "node_modules"
      ]
    };

    this.fs.writeJSON(this.destinationPath("tsconfig.json"), tsconfig);
  }

  end() {
    this.spawnCommandSync("git", [ "add", "tsconfig.json", "package.json", "yarn.lock" ]);
    this.spawnCommandSync("git", [ "commit", "-m", "Add TypeScript" ]);
  }
};
