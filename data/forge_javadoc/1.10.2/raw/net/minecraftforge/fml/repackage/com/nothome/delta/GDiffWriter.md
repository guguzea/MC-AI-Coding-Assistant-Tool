---
title: "GDiffWriter"
description: "public class GDiffWriter extends java.lang.Object implements DiffWriter"
package: "net/minecraftforge/fml/repackage/com/nothome/delta"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/repackage/com/nothome/delta/GDiffWriter.html"
sourceType: javadoc
---

# GDiffWriter

**Inheritance:** java.lang.Object → net.minecraftforge.fml.repackage.com.nothome.delta.GDiffWriter

## Class signature

```java
public class GDiffWriter extends java.lang.Object implements DiffWriter
```

## Constructors

- `GDiffWriter(java.io.DataOutputStream os)`
- `GDiffWriter(java.io.OutputStream output)`

## Methods

- `void addCopy(long offset, int length)` — Add a GDIFF copy instruction.
- `void addData(byte b)` — Adds a data byte.
- `void close()` — Writes the final EOF byte, closes the underlying stream.
- `void flush()` — Flushes accumulated data bytes, if any.

## Fields

- `static int CHUNK_SIZE` — Max length of a chunk.
- `static int COPY_INT_INT`
- `static int COPY_INT_UBYTE`
- `static int COPY_INT_USHORT`
- `static int COPY_LONG_INT`
- `static int COPY_USHORT_INT`
- `static int COPY_USHORT_UBYTE`
- `static int COPY_USHORT_USHORT`
- `static int DATA_INT`
- `static int DATA_MAX` — Max length for single length data encode.
- `static int DATA_USHORT`
- `static byte EOF`
