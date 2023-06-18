const Generator = require("yeoman-generator");

module.exports = class TypeScriptGenerator extends Generator {

  get packageJson() {
    return this.fs.readJSON(this.destinationPath("package.json")) ?? {};
  }

  get isReactProject() {
    return !!this.packageJson?.dependencies?.react;
  }

  async install() {
    await this.addDependencies([ "typescript" ]);

    if (!this.isReactProject) {
      await this.addDevDependencies([ "@types/node" ]);
    }
  }

  writing() {
    let tsconfig = {
      compilerOptions: {
        target: "esnext",
        lib: [
          ...this.isReactProject ? [ "dom" ] : [],
          "esnext"
        ],
        ...this.isReactProject ? { jsx: "react" } : {},
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
