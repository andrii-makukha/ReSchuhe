import { HandoffValidationError, validateHandoffPackage } from "./handoff.mjs";

const cliArguments = process.argv.slice(2);
if (cliArguments[0] === "--") {
  cliArguments.shift();
}
const [packagePath, ...unexpectedArguments] = cliArguments;

if (!packagePath || unexpectedArguments.length > 0) {
  console.error("Usage: pnpm assets:validate -- <handoff-package-path>");
  process.exitCode = 2;
} else {
  try {
    const result = await validateHandoffPackage(packagePath);
    console.log(
      "Validated " +
        result.manifest.assetId +
        " v" +
        String(result.manifest.version) +
        " with " +
        String(result.files.length) +
        " file(s).",
    );
  } catch (error) {
    const message =
      error instanceof HandoffValidationError ? error.message : "Unexpected validation failure.";
    console.error("Asset handoff rejected: " + message);
    process.exitCode = 1;
  }
}
