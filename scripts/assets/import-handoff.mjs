import path from "node:path";

import { HandoffValidationError, importHandoffPackage } from "./handoff.mjs";

const cliArguments = process.argv.slice(2);
if (cliArguments[0] === "--") {
  cliArguments.shift();
}
const [packagePath, ...unexpectedArguments] = cliArguments;

if (!packagePath || unexpectedArguments.length > 0) {
  console.error("Usage: pnpm assets:import -- <handoff-package-path>");
  process.exitCode = 2;
} else {
  try {
    const result = await importHandoffPackage(packagePath);
    const action = result.status === "imported" ? "Imported" : "Already imported";
    console.log(
      action +
        " " +
        result.manifest.assetId +
        " v" +
        String(result.manifest.version) +
        " at " +
        pathRelativeToWorkingDirectory(result.destination) +
        ".",
    );
  } catch (error) {
    const message =
      error instanceof HandoffValidationError ? error.message : "Unexpected import failure.";
    console.error("Asset handoff rejected: " + message);
    process.exitCode = 1;
  }
}

function pathRelativeToWorkingDirectory(destination) {
  const relative = path.relative(process.cwd(), destination);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative)
    ? relative
    : destination;
}
