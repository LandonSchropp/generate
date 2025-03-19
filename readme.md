# JavaScript/TypeScript Generators

This is a collection of generators for setting up JavaScript/TypeScript projects. It's built with
[plop](https://plopjs.com/).

## TL/DR

```bash
npx @landonschropp/generate
npx @landonschropp/generate initialize
npx @landonschropp/generate pretter
npx @landonschropp/generate only-allow
npx @landonschropp/generate eslint
npx @landonschropp/generate typescript
npx @landonschropp/generate husky
```

## Generators

These are the generators included with this project:

- `initialize`: Creates a package.json file. This is similar to `pnpm init`, but includes
  different options.
- `pretter`: Installs and configures [Prettier](https://prettier.io/).
- `only-allow`: Configures [only-allow](https://github.com/pnpm/only-allow).
- `eslint`: Installs and configures [ESLint](https://eslint.org/).
- `typescript`: Installs and configures [TypeScript](https://typescriptlang.org/).
- `husky`: Installs and configures [Husky](https://typicode.github.io/husky/) and
  [lint-staged](https://www.npmjs.com/package/lint-staged).

You can run a specific generator via [NPX](https://github.com/zkat/npx) like this:

```sh
npx @landonschropp/generate <generator>
```

You can run any of these generators independently, but if you're running more than one do so in the
order listed above.
