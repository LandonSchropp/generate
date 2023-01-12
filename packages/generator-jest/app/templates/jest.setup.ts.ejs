import "@testing-library/jest-dom";

import { configure } from "@testing-library/dom";

// Grab a reference to the global `it` function.
const it = global.it;

// Create a wrapper for `it` that calls `it.todo` when a function is not provided.
const wrappedIt = (description: Parameters<jest.It>[0], func: Parameters<jest.It>[1]) => {
  if (!func) {
    return it.todo(description);
  }

  return it(description, func);
};

// Replace the global `it` function with a proxy for the wrapper that uses the global `it` function
// for any other properties.
global.it = new Proxy<jest.It>(wrappedIt as jest.It, {
  get: (_target: jest.It, prop: keyof jest.It) => {
    return it[prop];
  }
}) as jest.It;

// Configure the testing library.
configure({ testIdAttribute: "data-test-id" });
