---
title: "DebugDiffWriter"
description: "public class DebugDiffWriter extends java.lang.Object implements DiffWriter"
package: "cpw/mods/fml/repackage/com/nothome/delta"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/repackage/com/nothome/delta/DebugDiffWriter.html"
sourceType: javadoc
---

# DebugDiffWriter

**Inheritance:** java.lang.Object → cpw.mods.fml.repackage.com.nothome.delta.DebugDiffWriter

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
