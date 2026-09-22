---
title: "Checksum"
description: "public class Checksum extends java.lang.Object"
package: "cpw/mods/fml/repackage/com/nothome/delta"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/repackage/com/nothome/delta/Checksum.html"
sourceType: javadoc
---

# Checksum

**Inheritance:** java.lang.Object → cpw.mods.fml.repackage.com.nothome.delta.Checksum

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
