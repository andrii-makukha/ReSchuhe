import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  HandoffValidationError,
  importHandoffPackage,
  validateHandoffPackage,
} from "./handoff.mjs";

const temporaryRoots = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { force: true, recursive: true })),
  );
});

async function createValidPackage() {
  const packageRoot = await mkdtemp(path.join(os.tmpdir(), "reschuhe-handoff-"));
  temporaryRoots.push(packageRoot);

  const filename = "technical-validation-fixture.svg";
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">' +
    '<rect width="10" height="10" /></svg>\n';
  const buffer = Buffer.from(svg);
  await writeFile(path.join(packageRoot, filename), buffer);

  const manifest = {
    schemaVersion: 1,
    assetId: "technical-validation-fixture",
    version: 1,
    status: "approved",
    title: "Technical validation fixture",
    purpose: "Verify the asset handoff tooling without introducing a product or brand asset.",
    placements: ["Automated workflow test"],
    accessibility: {
      role: "decorative",
      altText: "",
    },
    provenance: {
      sourceType: "illustration",
      creatorRole: "test-automation",
      tool: null,
      model: null,
      createdAt: "2025-01-01",
      sourceRecord: "studio:technical-validation-fixture/v1",
      materialEdits: ["Created as a synthetic non-production fixture."],
    },
    rights: {
      basis: "owned",
      summary: "Synthetic fixture created within the project test suite.",
      territories: ["worldwide"],
      expiresAt: null,
      restrictions: ["Testing only; not a ReSchuhe brand asset."],
    },
    approval: {
      approvedAt: "2025-01-01",
      reviewerRole: "test-automation",
      checks: ["accessibility", "brand", "intended-use", "provenance", "quality", "rights"],
    },
    files: [
      {
        file: filename,
        mediaType: "image/svg+xml",
        sha256: createHash("sha256").update(buffer).digest("hex"),
        bytes: buffer.byteLength,
        budgetBytes: 1024,
        width: 10,
        height: 10,
      },
    ],
  };

  await writeManifest(packageRoot, manifest);
  return { manifest, packageRoot };
}

async function writeManifest(packageRoot, manifest) {
  await writeFile(
    path.join(packageRoot, "asset-manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
}

describe("asset handoff", () => {
  it("validates a complete sanitized package", async () => {
    const fixture = await createValidPackage();

    const result = await validateHandoffPackage(fixture.packageRoot);

    expect(result.manifest.assetId).toBe("technical-validation-fixture");
    expect(result.files).toHaveLength(1);
  });

  it("rejects unlisted package content", async () => {
    const fixture = await createValidPackage();
    await writeFile(path.join(fixture.packageRoot, "private-notes.txt"), "not public");

    await expect(validateHandoffPackage(fixture.packageRoot)).rejects.toThrow(
      /unlisted or non-regular entry/,
    );
  });

  it("rejects a file that does not match its digest", async () => {
    const fixture = await createValidPackage();
    fixture.manifest.files[0].sha256 = "0".repeat(64);
    await writeManifest(fixture.packageRoot, fixture.manifest);

    await expect(validateHandoffPackage(fixture.packageRoot)).rejects.toThrow(/SHA-256/);
  });

  it("rejects an impossible calendar date", async () => {
    const fixture = await createValidPackage();
    fixture.manifest.provenance.createdAt = "2025-02-31";
    await writeManifest(fixture.packageRoot, fixture.manifest);

    await expect(validateHandoffPackage(fixture.packageRoot)).rejects.toThrow(/real calendar date/);
  });

  it("rejects sensitive text embedded in an otherwise safe asset", async () => {
    const fixture = await createValidPackage();
    const sensitiveSvg = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">' +
        '<desc>person@example.com</desc><rect width="10" height="10" /></svg>\n',
    );
    await writeFile(path.join(fixture.packageRoot, fixture.manifest.files[0].file), sensitiveSvg);
    fixture.manifest.files[0].sha256 = createHash("sha256").update(sensitiveSvg).digest("hex");
    fixture.manifest.files[0].bytes = sensitiveSvg.byteLength;
    await writeManifest(fixture.packageRoot, fixture.manifest);

    await expect(validateHandoffPackage(fixture.packageRoot)).rejects.toThrow(/email address/);
  });

  it("rejects active SVG content even when the digest is correct", async () => {
    const fixture = await createValidPackage();
    const unsafeSvg = Buffer.from('<svg viewBox="0 0 10 10"><script>alert(1)</script></svg>\n');
    await writeFile(path.join(fixture.packageRoot, fixture.manifest.files[0].file), unsafeSvg);
    fixture.manifest.files[0].sha256 = createHash("sha256").update(unsafeSvg).digest("hex");
    fixture.manifest.files[0].bytes = unsafeSvg.byteLength;
    await writeManifest(fixture.packageRoot, fixture.manifest);

    await expect(validateHandoffPackage(fixture.packageRoot)).rejects.toThrow(
      /disallowed active or external SVG content/,
    );
  });

  it("imports atomically and treats an identical retry as unchanged", async () => {
    const fixture = await createValidPackage();
    const destinationRoot = await mkdtemp(path.join(os.tmpdir(), "reschuhe-approved-"));
    temporaryRoots.push(destinationRoot);

    const firstImport = await importHandoffPackage(fixture.packageRoot, { destinationRoot });
    const secondImport = await importHandoffPackage(fixture.packageRoot, { destinationRoot });

    expect(firstImport.status).toBe("imported");
    expect(secondImport.status).toBe("unchanged");
    await expect(
      readFile(path.join(firstImport.destination, "asset-manifest.json"), "utf8"),
    ).resolves.toContain('"status": "approved"');

    fixture.manifest.title = "Changed immutable version";
    await writeManifest(fixture.packageRoot, fixture.manifest);

    await expect(
      importHandoffPackage(fixture.packageRoot, { destinationRoot }),
    ).rejects.toBeInstanceOf(HandoffValidationError);
  });
});
