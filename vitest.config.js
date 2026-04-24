import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    restoreMocks: true,
    mockReset: true,
    clearMocks: true,
    unstubGlobals: true,
    unstubEnvs: true,
  },
});
