import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],

  dts: true,
});
