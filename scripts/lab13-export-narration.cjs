// Prints the Lab 13 narration (src/lab13/narration.ts) as JSON on stdout.
const esbuild = require("esbuild");
const path = require("path");
const out = esbuild.buildSync({
  entryPoints: [path.join(__dirname, "../src/lab13/narration.ts")],
  bundle: true, write: false, format: "cjs", platform: "node",
});
const m = { exports: {} };
new Function("module", "exports", out.outputFiles[0].text)(m, m.exports);
process.stdout.write(JSON.stringify(m.exports.NARRATION, null, 1));
