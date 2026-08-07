import { describe, expect, it } from "vitest";

import {
  RasterMetadataError,
  stripJpegMetadata,
  stripPngMetadata,
} from "./strip-raster-metadata.mjs";

function jpegSegment(marker, data) {
  const length = Buffer.alloc(2);
  length.writeUInt16BE(data.length + 2);
  return Buffer.concat([Buffer.from([0xff, marker]), length, data]);
}

function pngChunk(type, data = Buffer.alloc(0)) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  return Buffer.concat([length, Buffer.from(type, "ascii"), data, Buffer.alloc(4)]);
}

describe("raster metadata stripping", () => {
  it("removes JPEG app metadata while retaining image and color segments", () => {
    const input = Buffer.concat([
      Buffer.from([0xff, 0xd8]),
      jpegSegment(0xe0, Buffer.from("JFIF\u0000")),
      jpegSegment(0xe1, Buffer.from("Exif\u0000\u0000private")),
      jpegSegment(0xe2, Buffer.from("ICC_PROFILE\u0000")),
      jpegSegment(0xe3, Buffer.from("unrecognized private app data")),
      jpegSegment(0xfe, Buffer.from("private comment")),
      jpegSegment(0xda, Buffer.alloc(0)),
      Buffer.from([0x01, 0x02, 0xff, 0xd9]),
    ]);

    const output = stripJpegMetadata(input);

    expect(output.includes(Buffer.from("Exif\u0000\u0000"))).toBe(false);
    expect(output.includes(Buffer.from("private comment"))).toBe(false);
    expect(output.includes(Buffer.from("unrecognized private app data"))).toBe(false);
    expect(output.includes(Buffer.from("JFIF\u0000"))).toBe(true);
    expect(output.includes(Buffer.from("ICC_PROFILE\u0000"))).toBe(true);
    expect(output.subarray(-2)).toEqual(Buffer.from([0xff, 0xd9]));
  });

  it("removes private PNG metadata chunks without rewriting image chunks", () => {
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(1, 0);
    ihdr.writeUInt32BE(1, 4);
    const input = Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      pngChunk("IHDR", ihdr),
      pngChunk("tEXt", Buffer.from("private comment")),
      pngChunk("IDAT", Buffer.from([0x01])),
      pngChunk("IEND"),
    ]);

    const output = stripPngMetadata(input);

    expect(output.includes(Buffer.from("tEXt"))).toBe(false);
    expect(output.includes(Buffer.from("private comment"))).toBe(false);
    expect(output.includes(Buffer.from("IDAT"))).toBe(true);
    expect(output.includes(Buffer.from("IEND"))).toBe(true);
  });

  it("rejects incomplete raster containers", () => {
    expect(() => stripJpegMetadata(Buffer.from([0xff, 0xd8, 0xff]))).toThrow(RasterMetadataError);
    expect(() => stripPngMetadata(Buffer.from("not a png"))).toThrow(RasterMetadataError);
  });
});
