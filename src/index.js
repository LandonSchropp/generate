#!/usr/bin/env node
import { toTitleCase } from "./utilities/string.js";
import chalk from "chalk";
import inquirer from "inquirer";
import minimist from "minimist";
import nodePlop from "node-plop";
import { join } from "path";
import { Plop, run } from "plop";

const argv = minimist(process.argv.slice(2));
const PLOPFILE_PATH = join(import.meta.dirname, "../plopfile.js");

/**
 * Hands control to plop's CLI. Used for single-generator invocations (`generate <name>
 * [...bypass]`), `--help`, and `--version`.
 */
function delegateToPlopCli() {
  Plop.prepare(
    {
      cwd: argv.cwd,
      configPath: PLOPFILE_PATH,
      preload: argv.preload || [],
      completion: argv.completion,
    },
    (env) => {
      return Plop.execute(env, (env) => {
        return run({ ...env, dest: process.cwd() }, undefined, true);
      });
    },
  );
}

/** Prompts the user with a checkbox of registered generators and returns the names they picked. */
async function selectGenerators(plop) {
  let choices = plop.getGeneratorList().map((generator) => {
    let title = toTitleCase(generator.name);

    return {
      name: `${title}\n   ${chalk.dim.italic(generator.description)}`,
      value: generator.name,
      short: title,
    };
  });

  let { selected } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selected",
      message: "Which generators would you like to run?",
      choices,
      pageSize: choices.length * 2,
    },
  ]);

  return selected;
}

/** Runs a single generator's prompts and actions. */
async function runGenerator(plop, name) {
  let generator = plop.getGenerator(name);
  let answers = await generator.runPrompts();
  await generator.runActions(answers);
}

/**
 * CLI entry point. If any arguments are passed, delegates to plop's built-in CLI (single generator,
 * `--help`, etc.). Otherwise, prompts the user to pick one or more generators with a checkbox and
 * runs each selection in sequence.
 */
async function main() {
  // If any arguments are provided, go ahead and delegate to Plop's normal CLI.
  if (process.argv.length > 2) {
    delegateToPlopCli();
    return;
  }

  // Select the generators to run.
  let plop = await nodePlop(PLOPFILE_PATH, { destBasePath: process.cwd() });
  let selected = await selectGenerators(plop);

  // If no generators were selected, then exit.
  if (selected.length === 0) {
    console.log(chalk.yellow("No generators selected."));
    return;
  }

  // Run each generator.
  for (let name of selected) {
    await runGenerator(plop, name);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
