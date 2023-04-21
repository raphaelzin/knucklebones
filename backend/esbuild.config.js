import * as esbuild from "esbuild";

const plugins = [];

esbuild.build({
  bundle: true,
  entryPoints: ["./src/app.ts"],
  minify: true,
  outfile: "./dist/app.cjs",
  platform: "node",
  sourcemap: "linked",
  plugins,
});
