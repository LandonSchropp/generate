import { getLatestNodeMajorVersion } from "./node.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("getLatestNodeMajorVersion", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => [{ version: "v25.3.1" }, { version: "v24.9.0" }],
      }),
    );
  });

  it("returns the major version of the first release in the index", async () => {
    expect(await getLatestNodeMajorVersion()).toBe(25);
  });

  it("fetches from the Node.js distribution index", async () => {
    await getLatestNodeMajorVersion();
    expect(fetch).toHaveBeenCalledWith("https://nodejs.org/dist/index.json");
  });
});
