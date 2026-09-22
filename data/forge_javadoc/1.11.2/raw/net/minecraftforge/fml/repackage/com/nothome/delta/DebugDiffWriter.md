---
title: "DebugDiffWriter"
description: "public class DebugDiffWriter extends java.lang.Object implements DiffWriter"
package: "net/minecraftforge/fml/repackage/com/nothome/delta"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/repackage/com/nothome/delta/DebugDiffWriter.html"
sourceType: javadoc
---

# DebugDiffWriter

**Inheritance:** java.lang.Object → net.minecraftforge.fml.repackage.com.nothome.delta.DebugDiffWriter

## Class signature

```java
public class DebugDiffWriter extends java.lang.Object implements DiffWriter
```

## Constructors

- `DebugDiffWriter()`

## Methods

- `void addCopy(long offset, int length)` — Add a GDIFF copy instruction.
- `void addData(byte b)` — Add a GDIFF data instruction.
- `void close()` — Closes this stream.
- `void flush()` — Flushes to output, e.g. any data added.
