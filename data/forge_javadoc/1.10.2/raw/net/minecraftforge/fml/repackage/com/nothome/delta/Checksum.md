---
title: "Checksum"
description: "public class Checksum extends java.lang.Object"
package: "net/minecraftforge/fml/repackage/com/nothome/delta"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/repackage/com/nothome/delta/Checksum.html"
sourceType: javadoc
---

# Checksum

**Inheritance:** java.lang.Object → net.minecraftforge.fml.repackage.com.nothome.delta.Checksum

## Class signature

```java
public class Checksum extends java.lang.Object
```

## Constructors

- `Checksum(SeekableSource source, int chunkSize)`

## Methods

- `int findChecksumIndex(long hashf)` — Finds the index of a checksum.
- `static char[] getSingleHash()` — 256 random hash values.
- `static long incrementChecksum(long checksum, byte out, byte in, int chunkSize)` — Increments a checksum.
- `static long queryChecksum(java.nio.ByteBuffer bb, int len)` — Finds the checksum computed from the buffer.
- `java.lang.String toString()` — Returns a debug String .
