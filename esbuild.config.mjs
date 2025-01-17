#!/usr/bin/env node

import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./src/ts/main.ts"],
  bundle: true,
  format: "esm",
  outfile: "./public/main.js"
});