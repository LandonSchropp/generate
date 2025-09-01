# JavaScript/TypeScript Generators

This is a collection of generators for setting up JavaScript/TypeScript projects. It's built with
[plop](https://plopjs.com/).

## TL/DR

```bash
pnpx @landonschropp/generate
pnpx @landonschropp/generate initialize
pnpx @landonschropp/generate prettier
pnpx @landonschropp/generate only-allow
pnpx @landonschropp/generate eslint
pnpx @landonschropp/generate typescript
pnpx @landonschropp/generate jest
pnpx @landonschropp/generate husky
```

## Generators

These are the generators included with this project:

- `initialize`: Creates a package.json file. This is similar to `pnpm init`, but includes
  different options.
- `prettier`: Installs and configures [Prettier](https://prettier.io/).
- `only-allow`: Configures [only-allow](https://github.com/pnpm/only-allow).
- `eslint`: Installs and configures [ESLint](https://eslint.org/).
- `typescript`: Installs and configures [TypeScript](https://typescriptlang.org/).
- `jest`: Installs and sets up [Jest](https://jestjs.io/).
- `husky`: Installs and configures [Husky](https://typicode.github.io/husky/) and
  [lint-staged](https://www.npmjs.com/package/lint-staged).

You can run a specific generator via [pnpx](https://pnpm.io/cli/dlx) like this:

```sh
pnpx @landonschropp/generate <generator>
```

You can run any of these generators independently, but if you're running more than one do so in the
order listed above.

## Development

Executing this project is as simple as calling `./src/index.js`, which is executable.

```sh
./src/index.js
```
