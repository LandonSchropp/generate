# Landon Schropp's Yeoman Generators

This is my personal, *opinionated* collection of Yeoman generators to make spinning up JavaScript
projects easy and enjoyable.

## TL/DR

**BUG FIX: Right now the main release of `yo` is broken. To fix it, use `yo` instead.**

``` bash
npx -p yo -p @landonschropp/generator-babel yo @landonschropp/babel
npx -p yo -p @landonschropp/generator-eslint yo @landonschropp/eslint
npx -p yo -p @landonschropp/generator-language-server yo @landonschropp/language-server
```

## The Generators

This project includes several generators.

* [babel](packages/generator-babel/readme.md): Sets up Babel and optionally installs a few useful
  plugins I use often.
* [eslint](packages/generator-eslint/readme.md): Adds my personal ESLint configuration to a project.
* [language-server](packages/generator-language-server/readme.md): Configures a JavaScript language
  server.

Run the generator of your choice with [NPX](https://github.com/zkat/npx). NPX allows you to run the
generator once without having to install anything. Answer the generator's prompts, and you're done!

``` sh
npx -p yo -p @landonschropp/generator-<generator> yo @landonschropp/<generator>
```

You can also see the documentation and options for each generator by including the `--help` flag.

``` sh
npx -p yo -p @landonschropp/generator-eslint yo @landonschropp/eslint --help
```

You can run any of these generators independently. However, please be aware that some
generators have dependencies. For example, the ESLint generator requires Babel to be installed.

## Development

### Updating

This repo uses Yarn workspaces, so updating all of the packages is easy.

```
yarn upgrade-interactive --latest
```

### Publishing

Publishing all of the packages is also a breeze thanks to Lerna. First, make sure the
`NPM_TOKEN` environment variable is set. Then, all you need to do is run the following command.

``` sh
lerna publish
```

### Example Project

While developing a generator, it's common to create an empty directory to run the generator in.
Because this is done so frequently, this repository includes a handy script that does this
automatically.

``` sh
yarn set-up-example-project
```

This script does a few things for you:

* It automatically runs `yarn install` so you don't have to.
* It creates a new `example` directory, sets it up as a Node package, and initializes a Git
  repository so you can any changes your package may introduce.
* It links all of the packages in the `packages` directory via Yarn.

Once the script is done, all you need to do is change into the `example` directory and run
`yo @landonschropp/<generator>` to test out one of the generators.
