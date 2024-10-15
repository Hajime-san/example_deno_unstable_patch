# example_deno_unstable_patch

This repository is meant to demonstrate use cases for the `patch` feature in Deno with minimal code.

- https://github.com/denoland/deno/issues/25110

> [!NOTE]  
> Please note that this feature is currently provided as unstable and may change in the future.

## Scenario

If you want to use the `foo` JSR package that depends on `bar` JSR package.  
Unfortunately, the latest `bar` JSR package has a bug.  
So, you wish to use the safe version of `bar` JSR package.  

## Example

> [!NOTE]  
> The examples below are for illustrative purposes only.

You have codes like below.  
And, you noticed that the `Buffer` class from `jsr:@std/streams@1.0.7` has a bug which depends on `jsr:@std/bytes@1.0.2/copy` [inside](https://github.com/denoland/std/blob/39278721df5ab242cd6eba53f6c6e7dcd92b30d6/import_map.json#L12).  
After some research, you discover that version `jsr:@std/bytes@1.0.0/copy` works fine and decide to use that version as a workaround.
In this case, the `patch` feature is exactly what it means to replace dependencies without making major changes to existing code.

```json
{
  "imports": {
    "@std/assert": "jsr:@std/assert@1.0.6",
    "@std/streams": "jsr:@std/streams@1.0.7"
  }
}
```

```ts
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
```

## Reproduce patching

1. First, download the file you want to patch.  
  Set the `vendor` option to be `true` in `deno.json` is quick.

2. Add `patch/streams/deno.jsonc`.  
  And replace the modulespecifier from `jsr:@std/bytes@^1.0.2/copy` to `jsr:@std/bytes@1.0.0/copy` in `patch/streams/1.0.7/buffer.ts`.

3. Run `deno run streams.ts`.  
  Finally, the `deno.lock` shows your sub dependency was replaced.

https://github.com/Hajime-san/example_deno_unstable_patch/blob/1c05056c1f2e425f849681bd424bdd4d5b9301f5/deno.lock#L5