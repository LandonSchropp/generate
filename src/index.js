#!/usr/bin/env node
import minimist from "minimist";
import { dirname, join } from "path";
import { Plop, run } from "plop";
import { fileURLToPath } from "url";

const argv = minimist(process.argv.slice(2));
const __dirname = dirname(fileURLToPath(import.meta.url));

Plop.prepare(
  {
    cwd: argv.cwd,
    configPath: join(__dirname, "../plopfile.js"),
    preload: argv.preload || [],
    completion: argv.completion,
  },
  (env) => {
    return Plop.execute(env, (env) => {
      return run({ ...env, dest: process.cwd() }, undefined, true);
    });
  },
);
