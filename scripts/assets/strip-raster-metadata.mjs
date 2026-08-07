#!/usr/bin/env node

import { randomUUID } from "node:crypto";
import { lstat, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const PNG_METADATA_CHUNKS = new Set(["eXIf", "iTXt", "tEXt", "tIME", "zTXt"]);

export class RasterMetadataError extends Error {
  constructor(message) {
    super(message);
    this.name = "RasterMetadataError";
  }
}

function startsWith(buffer, prefix) {
  return buffer.length >= prefix.length && prefix.every((byte, index) => buffer[index] === byte);
}

function isPreservedJpegAppSegment(marker, data) {
  return (
    (marker === 0xe0 &&
      (startsWith(data, [...Buffer.from("JFIF\u0000")]) ||
        startsWith(data, [...Buffer.from("JFXX\u0000")]))) ||
    (marker === 0xe2 && startsWith(data, [...Buffer.from("ICC_PROFILE\u0000")])) ||
    (marker === 0xee && startsWith(data, [...Buffer.from("Adobe")]))
  );
}

export function stripJpegMetadata(buffer) {
  if (
    !startsWith(buffer, [0xff, 0xd8, 0xff]) ||
    buffer.length < 5 ||
    buffer[buffer.length - 2] !== 0xff ||
    buffer[buffer.length - 1] !== 0xd9
  ) {
    throw new RasterMetadataError("Input does not have a complete JPEG container.");
  }

  const output = [buffer.subarray(0, 2)];
  let offset = 2;
  let reachedScan = false;

  while (offset < buffer.length) {
    const markerStart = offset;
    if (buffer[offset] !== 0xff) {
      throw new RasterMetadataError("JPEG contains an invalid segment boundary.");
    }

    while (offset < buffer.length && buffer[offset] === 0xff) {
      offset += 1;
    }
    if (offset >= buffer.length) {
      throw new RasterMetadataError("JPEG ends inside a marker.");
    }

    const marker = buffer[offset];
    offset += 1;

    if (marker === 0xda) {
      if (offset + 2 > buffer.length) {
        throw new RasterMetadataError("JPEG scan header is incomplete.");
      }
      const segmentLength = buffer.readUInt16BE(offset);
      const segmentEnd = offset + segmentLength;
      if (segmentLength < 2 || segmentEnd > buffer.length) {
        throw new RasterMetadataError("JPEG scan header has an invalid length.");
      }

      output.push(buffer.subarray(markerStart, segmentEnd));
      output.push(buffer.subarray(segmentEnd));
      reachedScan = true;
      break;
    }

    if (marker === 0xd9) {
      output.push(buffer.subarray(markerStart, offset));
      break;
    }

    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      output.push(buffer.subarray(markerStart, offset));
      continue;
    }

    if (offset + 2 > buffer.length) {
      throw new RasterMetadataError("JPEG segment header is incomplete.");
    }
    const segmentLength = buffer.readUInt16BE(offset);
    const segmentEnd = offset + segmentLength;
    if (segmentLength < 2 || segmentEnd > buffer.length) {
      throw new RasterMetadataError("JPEG segment has an invalid length.");
    }

    const segmentData = buffer.subarray(offset + 2, segmentEnd);
    const isComment = marker === 0xfe;
    const isAppSegment = marker >= 0xe0 && marker <= 0xef;
    if (!isComment && (!isAppSegment || isPreservedJpegAppSegment(marker, segmentData))) {
      output.push(buffer.subarray(markerStart, segmentEnd));
    }
    offset = segmentEnd;
  }

  if (!reachedScan) {
    throw new RasterMetadataError("JPEG does not contain an image scan.");
  }

  return Buffer.concat(output);
}

export function stripPngMetadata(buffer) {
  if (!startsWith(buffer, [...PNG_SIGNATURE])) {
    throw new RasterMetadataError("Input does not have a valid PNG signature.");
  }

  const output = [buffer.subarray(0, PNG_SIGNATURE.length)];
  let offset = PNG_SIGNATURE.length;
  let chunkIndex = 0;
  let reachedEnd = false;

  while (offset + 12 <= buffer.length) {
    const chunkLength = buffer.readUInt32BE(offset);
    const chunkType = buffer.toString("ascii", offset + 4, offset + 8);
    const chunkEnd = offset + 12 + chunkLength;
    if (chunkEnd > buffer.length) {
      throw new RasterMetadataError("PNG contains an invalid chunk length.");
    }
    if (chunkIndex === 0 && (chunkType !== "IHDR" || chunkLength !== 13)) {
      throw new RasterMetadataError("PNG must begin with a complete IHDR chunk.");
    }

    if (!PNG_METADATA_CHUNKS.has(chunkType)) {
      output.push(buffer.subarray(offset, chunkEnd));
    }

    if (chunkType === "IEND") {
      if (chunkLength !== 0 || chunkEnd !== buffer.length) {
        throw new RasterMetadataError("PNG contains data after its end chunk.");
      }
      reachedEnd = true;
      break;
    }

    offset = chunkEnd;
    chunkIndex += 1;
  }

  if (!reachedEnd) {
    throw new RasterMetadataError("PNG does not contain a complete end chunk.");
  }

  return Buffer.concat(output);
}

export function stripRasterMetadata(buffer, extension) {
  switch (extension.toLowerCase()) {
    case ".jpeg":
    case ".jpg":
      return stripJpegMetadata(buffer);
    case ".png":
      return stripPngMetadata(buffer);
    default:
      throw new RasterMetadataError("Only JPEG and PNG metadata stripping is supported.");
  }
}

export async function stripRasterMetadataFile(filePath) {
  const resolvedPath = path.resolve(filePath);
  const fileStat = await lstat(resolvedPath).catch(() => null);
  if (fileStat === null || !fileStat.isFile() || fileStat.isSymbolicLink()) {
    throw new RasterMetadataError("Input must be a regular JPEG or PNG file.");
  }

  const input = await readFile(resolvedPath);
  const output = stripRasterMetadata(input, path.extname(resolvedPath));
  const temporaryPath = path.join(
    path.dirname(resolvedPath),
    "." + path.basename(resolvedPath) + ".sanitize-" + randomUUID(),
  );

  try {
    await writeFile(temporaryPath, output, {
      flag: "wx",
      mode: fileStat.mode & 0o777,
    });
    await rename(temporaryPath, resolvedPath);
  } catch (error) {
    await rm(temporaryPath, { force: true });
    throw error;
  }

  return {
    afterBytes: output.length,
    beforeBytes: input.length,
    removedBytes: input.length - output.length,
  };
}

const isDirectInvocation =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectInvocation) {
  const cliArguments = process.argv.slice(2);
  if (cliArguments[0] === "--") {
    cliArguments.shift();
  }
  const [filePath, ...unexpectedArguments] = cliArguments;

  if (!filePath || unexpectedArguments.length > 0) {
    console.error("Usage: strip-raster-metadata.mjs <jpeg-or-png-path>");
    process.exitCode = 2;
  } else {
    try {
      const result = await stripRasterMetadataFile(filePath);
      console.log(
        "Removed " +
          String(result.removedBytes) +
          " metadata byte(s); sanitized file is " +
          String(result.afterBytes) +
          " byte(s).",
      );
    } catch (error) {
      const message =
        error instanceof RasterMetadataError ? error.message : "Unexpected metadata-strip failure.";
      console.error("Metadata stripping failed: " + message);
      process.exitCode = 1;
    }
  }
}
