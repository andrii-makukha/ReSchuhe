import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import {
  copyFile,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

const MANIFEST_FILENAME = "asset-manifest.json";
const MAX_MANIFEST_BYTES = 128 * 1024;
const MAX_ASSET_BYTES = 10 * 1024 * 1024;
const MAX_SVG_BYTES = 512 * 1024;

const REQUIRED_APPROVAL_CHECKS = [
  "accessibility",
  "brand",
  "intended-use",
  "provenance",
  "quality",
  "rights",
];

const MEDIA_TYPE_BY_EXTENSION = new Map([
  [".avif", "image/avif"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
]);

const publicTextSchema = z.string().trim().min(1).max(500);
const optionalPublicTextSchema = z.string().trim().min(1).max(160).nullable();
const isRealIsoDate = (value) => {
  const parsed = new Date(value + "T00:00:00Z");
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
};
const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use an ISO date in YYYY-MM-DD format.")
  .refine(isRealIsoDate, "Use a real calendar date.");

const accessibilitySchema = z.discriminatedUnion("role", [
  z
    .object({
      role: z.literal("decorative"),
      altText: z.literal(""),
    })
    .strict(),
  z
    .object({
      role: z.literal("informative"),
      altText: z.string().trim().min(1).max(500),
    })
    .strict(),
]);

const fileSchema = z
  .object({
    file: z
      .string()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:avif|jpeg|jpg|png|svg|webp)$/,
        "Use a lowercase kebab-case filename with one approved image extension.",
      )
      .max(120),
    mediaType: z.enum(["image/avif", "image/jpeg", "image/png", "image/svg+xml", "image/webp"]),
    sha256: z.string().regex(/^[a-f0-9]{64}$/, "Use a lowercase SHA-256 digest."),
    bytes: z.number().int().positive().max(MAX_ASSET_BYTES),
    budgetBytes: z.number().int().positive().max(MAX_ASSET_BYTES),
    width: z.number().int().positive().max(16_384),
    height: z.number().int().positive().max(16_384),
  })
  .strict();

export const assetManifestSchema = z
  .object({
    schemaVersion: z.literal(1),
    assetId: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a stable lowercase kebab-case asset identifier.")
      .max(80),
    version: z.number().int().positive().max(9999),
    status: z.literal("approved"),
    title: z.string().trim().min(1).max(120),
    purpose: publicTextSchema,
    placements: z.array(z.string().trim().min(1).max(160)).min(1).max(20),
    accessibility: accessibilitySchema,
    provenance: z
      .object({
        sourceType: z.enum([
          "generated",
          "illustration",
          "licensed",
          "other",
          "photography",
          "provided",
        ]),
        creatorRole: z.string().trim().min(1).max(80),
        tool: optionalPublicTextSchema,
        model: optionalPublicTextSchema,
        createdAt: isoDateSchema,
        sourceRecord: z
          .string()
          .regex(
            /^studio:[a-z0-9]+(?:-[a-z0-9]+)*\/v[1-9]\d*$/,
            "Reference the private Studio record as studio:<asset-id>/v<version>.",
          ),
        materialEdits: z.array(z.string().trim().min(1).max(240)).max(30),
      })
      .strict(),
    rights: z
      .object({
        basis: z.enum(["commissioned", "consented", "licensed", "owned", "public-domain"]),
        summary: publicTextSchema,
        territories: z.array(z.string().trim().min(1).max(80)).min(1).max(30),
        expiresAt: isoDateSchema.nullable(),
        restrictions: z.array(z.string().trim().min(1).max(240)).max(30),
      })
      .strict(),
    approval: z
      .object({
        approvedAt: isoDateSchema,
        reviewerRole: z.string().trim().min(1).max(80),
        checks: z
          .array(
            z.enum(["accessibility", "brand", "intended-use", "provenance", "quality", "rights"]),
          )
          .length(REQUIRED_APPROVAL_CHECKS.length),
      })
      .strict(),
    files: z.array(fileSchema).min(1).max(12),
  })
  .strict()
  .superRefine((manifest, context) => {
    const filenames = manifest.files.map((file) => file.file);
    if (new Set(filenames).size !== filenames.length) {
      context.addIssue({
        code: "custom",
        message: "Every file entry must have a unique filename.",
        path: ["files"],
      });
    }

    for (const [index, file] of manifest.files.entries()) {
      const extension = path.extname(file.file);
      if (MEDIA_TYPE_BY_EXTENSION.get(extension) !== file.mediaType) {
        context.addIssue({
          code: "custom",
          message: "The media type must match the filename extension.",
          path: ["files", index, "mediaType"],
        });
      }

      if (file.bytes > file.budgetBytes) {
        context.addIssue({
          code: "custom",
          message: "The optimized file exceeds its approved byte budget.",
          path: ["files", index, "bytes"],
        });
      }

      if (file.mediaType === "image/svg+xml" && file.bytes > MAX_SVG_BYTES) {
        context.addIssue({
          code: "custom",
          message: "SVG files must not exceed 512 KiB.",
          path: ["files", index, "bytes"],
        });
      }
    }

    const approvalChecks = new Set(manifest.approval.checks);
    for (const requiredCheck of REQUIRED_APPROVAL_CHECKS) {
      if (!approvalChecks.has(requiredCheck)) {
        context.addIssue({
          code: "custom",
          message: "The approval record is missing the " + requiredCheck + " check.",
          path: ["approval", "checks"],
        });
      }
    }

    const expectedSourceRecord = "studio:" + manifest.assetId + "/v" + String(manifest.version);
    if (manifest.provenance.sourceRecord !== expectedSourceRecord) {
      context.addIssue({
        code: "custom",
        message: "The private Studio reference must match the asset ID and version.",
        path: ["provenance", "sourceRecord"],
      });
    }

    const today = new Date().toISOString().slice(0, 10);
    if (manifest.provenance.createdAt > today) {
      context.addIssue({
        code: "custom",
        message: "The creation date cannot be in the future.",
        path: ["provenance", "createdAt"],
      });
    }

    if (manifest.approval.approvedAt > today) {
      context.addIssue({
        code: "custom",
        message: "The approval date cannot be in the future.",
        path: ["approval", "approvedAt"],
      });
    }

    if (manifest.approval.approvedAt < manifest.provenance.createdAt) {
      context.addIssue({
        code: "custom",
        message: "Approval cannot predate creation.",
        path: ["approval", "approvedAt"],
      });
    }

    if (manifest.rights.expiresAt !== null && manifest.rights.expiresAt < today) {
      context.addIssue({
        code: "custom",
        message: "The recorded usage rights have expired.",
        path: ["rights", "expiresAt"],
      });
    }
  });

export class HandoffValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "HandoffValidationError";
  }
}

function formatZodIssues(issues) {
  return issues
    .map((issue) => {
      const location = issue.path.length > 0 ? issue.path.join(".") : "manifest";
      return location + ": " + issue.message;
    })
    .join("; ");
}

const SENSITIVE_TEXT_PATTERNS = [
  ["a local macOS path", /\/Users\/[^/"'<>\s]+/],
  ["a local Linux path", /\/home\/[^/"'<>\s]+/],
  ["a local macOS temporary path", /\/private\/var\/folders\/[^"'<>\s]+/],
  ["a local Windows path", /[A-Za-z]:\\(?:Users|Documents and Settings)\\[^"'<>\s]+/i],
  ["an email address", /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i],
  ["a GitHub token", /gh[pousr]_[A-Za-z0-9_]{20,}/],
  ["a Google API key", /AIza[0-9A-Za-z_-]{30,}/],
  ["a private key", /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/],
];

function assertNoSensitiveText(text, subject) {
  const blockedPattern = SENSITIVE_TEXT_PATTERNS.find(([, pattern]) => pattern.test(text));
  if (blockedPattern) {
    throw new HandoffValidationError(subject + " contains " + blockedPattern[0] + ".");
  }
}

function assertNoSensitivePublicValues(value) {
  if (typeof value === "string") {
    assertNoSensitiveText(value, "The public manifest");
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      assertNoSensitivePublicValues(item);
    }
    return;
  }

  if (value !== null && typeof value === "object") {
    for (const item of Object.values(value)) {
      assertNoSensitivePublicValues(item);
    }
  }
}

function bufferStartsWith(buffer, bytes) {
  if (buffer.length < bytes.length) {
    return false;
  }

  return bytes.every((byte, index) => buffer[index] === byte);
}

function assertPngStructureAndMetadata(buffer, filename) {
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (!bufferStartsWith(buffer, signature)) {
    throw new HandoffValidationError(filename + " does not have a valid PNG signature.");
  }

  let offset = 8;
  let foundEnd = false;
  while (offset + 12 <= buffer.length) {
    const chunkLength = buffer.readUInt32BE(offset);
    const chunkType = buffer.toString("ascii", offset + 4, offset + 8);
    const nextOffset = offset + 12 + chunkLength;
    if (nextOffset > buffer.length) {
      throw new HandoffValidationError(filename + " contains an invalid PNG chunk.");
    }

    if (["eXIf", "iTXt", "tEXt", "zTXt"].includes(chunkType)) {
      throw new HandoffValidationError(filename + " still contains embedded metadata.");
    }

    if (chunkType === "IEND") {
      if (chunkLength !== 0 || nextOffset !== buffer.length) {
        throw new HandoffValidationError(filename + " contains data after its PNG end chunk.");
      }
      foundEnd = true;
      break;
    }

    offset = nextOffset;
  }

  if (!foundEnd) {
    throw new HandoffValidationError(filename + " does not contain a valid PNG end chunk.");
  }
}

function assertWebpStructureAndMetadata(buffer, filename) {
  if (
    buffer.length < 12 ||
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WEBP"
  ) {
    throw new HandoffValidationError(filename + " does not have a valid WebP signature.");
  }

  if (buffer.readUInt32LE(4) + 8 !== buffer.length) {
    throw new HandoffValidationError(filename + " does not have a valid WebP container size.");
  }

  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const chunkType = buffer.toString("ascii", offset, offset + 4);
    const chunkLength = buffer.readUInt32LE(offset + 4);
    if (["EXIF", "XMP "].includes(chunkType)) {
      throw new HandoffValidationError(filename + " still contains embedded metadata.");
    }

    offset += 8 + chunkLength + (chunkLength % 2);
    if (offset > buffer.length) {
      throw new HandoffValidationError(filename + " contains an invalid WebP chunk.");
    }
  }

  if (offset !== buffer.length) {
    throw new HandoffValidationError(filename + " contains trailing or incomplete WebP data.");
  }
}

function assertSvgSafety(buffer, filename) {
  const text = buffer.toString("utf8");
  if (!/<svg(?:\s|>)/i.test(text) || !/\bviewBox\s*=/i.test(text)) {
    throw new HandoffValidationError(filename + " must contain an SVG root and viewBox.");
  }

  const blockedPatterns = [
    /<!DOCTYPE/i,
    /<!--|<!\[CDATA\[|<\?/i,
    /<(?:embed|foreignObject|iframe|metadata|object|script|style)\b/i,
    /\son[a-z]+\s*=/i,
    /(?:href|xlink:href)\s*=\s*["'](?!#)/i,
    /javascript\s*:/i,
    /@import/i,
    /url\s*\(\s*["']?(?:data:|https?:|\/\/)/i,
  ];

  if (blockedPatterns.some((pattern) => pattern.test(text))) {
    throw new HandoffValidationError(
      filename + " contains disallowed active or external SVG content.",
    );
  }

  if (!/<\/svg>\s*$/i.test(text)) {
    throw new HandoffValidationError(filename + " must end after its SVG root element.");
  }
}

function assertRasterMetadataIsStripped(buffer, filename) {
  const markers = [
    Buffer.from("Exif\u0000\u0000", "latin1"),
    Buffer.from("Photoshop 3.0", "latin1"),
    Buffer.from("http://ns.adobe.com/xap/1.0/", "latin1"),
    Buffer.from("<x:xmpmeta", "utf8"),
  ];

  if (markers.some((marker) => buffer.includes(marker))) {
    throw new HandoffValidationError(
      filename + " still contains embedded EXIF, IPTC, or XMP metadata.",
    );
  }
}

function assertFileContent(buffer, file) {
  const filename = file.file;
  assertNoSensitiveText(buffer.toString("utf8"), filename);
  switch (file.mediaType) {
    case "image/avif": {
      const isIsoBaseMedia = buffer.length >= 16 && buffer.toString("ascii", 4, 8) === "ftyp";
      const brands = buffer.toString("ascii", 8, Math.min(buffer.length, 64));
      if (!isIsoBaseMedia || !/(?:avif|avis)/.test(brands)) {
        throw new HandoffValidationError(filename + " does not have a valid AVIF signature.");
      }
      assertRasterMetadataIsStripped(buffer, filename);
      break;
    }
    case "image/jpeg":
      if (
        !bufferStartsWith(buffer, [0xff, 0xd8, 0xff]) ||
        buffer.length < 5 ||
        buffer[buffer.length - 2] !== 0xff ||
        buffer[buffer.length - 1] !== 0xd9
      ) {
        throw new HandoffValidationError(filename + " does not have a valid JPEG signature.");
      }
      assertRasterMetadataIsStripped(buffer, filename);
      break;
    case "image/png":
      assertPngStructureAndMetadata(buffer, filename);
      break;
    case "image/svg+xml":
      assertSvgSafety(buffer, filename);
      break;
    case "image/webp":
      assertWebpStructureAndMetadata(buffer, filename);
      break;
    default:
      throw new HandoffValidationError(filename + " has an unsupported media type.");
  }
}

export async function sha256File(filePath) {
  return await new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const input = createReadStream(filePath);
    input.on("error", reject);
    input.on("data", (chunk) => hash.update(chunk));
    input.on("end", () => resolve(hash.digest("hex")));
  });
}

async function assertRegularFile(filePath, label) {
  const fileStat = await lstat(filePath).catch((error) => {
    if (error?.code === "ENOENT") {
      throw new HandoffValidationError(label + " is missing from the handoff package.");
    }
    throw error;
  });
  if (!fileStat.isFile() || fileStat.isSymbolicLink()) {
    throw new HandoffValidationError(label + " must be a regular file, not a link or directory.");
  }
  return fileStat;
}

export async function validateHandoffPackage(packagePath) {
  const root = path.resolve(packagePath);
  const rootStat = await lstat(root).catch(() => null);
  if (rootStat === null || !rootStat.isDirectory() || rootStat.isSymbolicLink()) {
    throw new HandoffValidationError("The handoff package must be a real directory.");
  }

  const manifestPath = path.join(root, MANIFEST_FILENAME);
  const manifestStat = await assertRegularFile(manifestPath, MANIFEST_FILENAME).catch((error) => {
    if (error instanceof HandoffValidationError) {
      throw error;
    }
    throw new HandoffValidationError("The package must contain " + MANIFEST_FILENAME + ".");
  });

  if (manifestStat.size > MAX_MANIFEST_BYTES) {
    throw new HandoffValidationError("The public manifest exceeds 128 KiB.");
  }

  let manifestInput;
  try {
    manifestInput = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch {
    throw new HandoffValidationError("The asset manifest is not valid JSON.");
  }

  const parsedManifest = assetManifestSchema.safeParse(manifestInput);
  if (!parsedManifest.success) {
    throw new HandoffValidationError(formatZodIssues(parsedManifest.error.issues));
  }

  const manifest = parsedManifest.data;
  assertNoSensitivePublicValues(manifest);

  const expectedEntries = new Set([MANIFEST_FILENAME, ...manifest.files.map((file) => file.file)]);
  const actualEntries = await readdir(root, { withFileTypes: true });
  for (const entry of actualEntries) {
    if (!entry.isFile() || entry.isSymbolicLink() || !expectedEntries.has(entry.name)) {
      throw new HandoffValidationError(
        "The package contains an unlisted or non-regular entry: " + entry.name + ".",
      );
    }
  }

  if (actualEntries.length !== expectedEntries.size) {
    throw new HandoffValidationError("The package is missing one or more manifest-listed files.");
  }

  const validatedFiles = [];
  for (const file of manifest.files) {
    const filePath = path.join(root, file.file);
    const fileStat = await assertRegularFile(filePath, file.file);
    if (fileStat.size !== file.bytes) {
      throw new HandoffValidationError(file.file + " does not match its recorded byte size.");
    }

    const digest = await sha256File(filePath);
    if (digest !== file.sha256) {
      throw new HandoffValidationError(file.file + " does not match its recorded SHA-256 digest.");
    }

    const buffer = await readFile(filePath);
    assertFileContent(buffer, file);
    validatedFiles.push({ ...file, filePath });
  }

  return {
    packagePath: root,
    manifest,
    files: validatedFiles,
  };
}

function canonicalManifest(manifest) {
  return JSON.stringify(manifest);
}

export async function importHandoffPackage(
  packagePath,
  { repositoryRoot = process.cwd(), destinationRoot } = {},
) {
  const validated = await validateHandoffPackage(packagePath);
  const approvedRoot = destinationRoot
    ? path.resolve(destinationRoot)
    : path.resolve(repositoryRoot, "src/assets/approved");
  const assetRoot = path.join(approvedRoot, validated.manifest.assetId);
  const finalDirectory = path.join(assetRoot, "v" + String(validated.manifest.version));

  const existingStat = await lstat(finalDirectory).catch(() => null);
  if (existingStat !== null) {
    const existing = await validateHandoffPackage(finalDirectory);
    if (canonicalManifest(existing.manifest) === canonicalManifest(validated.manifest)) {
      return {
        status: "unchanged",
        destination: finalDirectory,
        manifest: validated.manifest,
      };
    }

    throw new HandoffValidationError(
      "Approved asset versions are immutable; use a new version instead of overwriting.",
    );
  }

  await mkdir(assetRoot, { recursive: true });
  const temporaryDirectory = await mkdtemp(path.join(assetRoot, ".import-"));

  try {
    for (const file of validated.files) {
      await copyFile(file.filePath, path.join(temporaryDirectory, file.file));
    }

    await writeFile(
      path.join(temporaryDirectory, MANIFEST_FILENAME),
      JSON.stringify(validated.manifest, null, 2) + "\n",
      { encoding: "utf8", mode: 0o644 },
    );
    await validateHandoffPackage(temporaryDirectory);
    await rename(temporaryDirectory, finalDirectory);
  } catch (error) {
    await rm(temporaryDirectory, { force: true, recursive: true });
    throw error;
  }

  return {
    status: "imported",
    destination: finalDirectory,
    manifest: validated.manifest,
  };
}
