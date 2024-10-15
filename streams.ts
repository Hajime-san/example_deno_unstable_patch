// This example took from below link
// https://github.com/denoland/std/blob/39278721df5ab242cd6eba53f6c6e7dcd92b30d6/streams/buffer.ts#L68
import { Buffer } from "@std/streams/buffer";
import { assert } from "@std/assert";
import { assertEquals } from "@std/assert";

// Create a new buffer
const buf = new Buffer();
assertEquals(buf.capacity, 0);
assertEquals(buf.length, 0);

// Dummy input stream
const inputStream = ReadableStream.from([
  "hello, ",
  "world",
  "!",
]);

// Pipe the input stream to the buffer
await inputStream.pipeThrough(new TextEncoderStream()).pipeTo(buf.writable);
assert(buf.capacity > 0);
assert(buf.length > 0);
