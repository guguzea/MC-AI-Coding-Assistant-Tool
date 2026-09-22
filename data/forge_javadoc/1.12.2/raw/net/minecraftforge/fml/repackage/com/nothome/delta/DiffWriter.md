---
title: "DiffWriter"
description: "public interface DiffWriter extends java.io.Closeable"
package: "net/minecraftforge/fml/repackage/com/nothome/delta"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/repackage/com/nothome/delta/DiffWriter.html"
sourceType: javadoc
---

# DiffWriter

## Class signature

```java
public interface DiffWriter extends java.io.Closeable
```

## Methods

- `void addCopy(long offset, int length)` — Add a GDIFF copy instruction.
- `void addData(byte b)` — Add a GDIFF data instruction.
- `void close()` — Closes this stream.
- `void flush()` — Flushes to output, e.g. any data added.
