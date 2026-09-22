---
title: "RegionFile"
description: "public class RegionFile extends java.lang.Object"
package: "net/minecraft/world/chunk/storage"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/chunk/storage/RegionFile.html"
sourceType: javadoc
---

# RegionFile

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.storage.RegionFile

## Class signature

```java
public class RegionFile extends java.lang.Object
```

## Constructors

- `RegionFile(java.io.File fileNameIn)`

## Methods

- `boolean chunkExists(int x, int z)`
- `void close()` — close this RegionFile and prevent further writes
- `java.io.DataInputStream getChunkDataInputStream(int x, int z)` — Returns an uncompressed chunk stream from the region file.
- `java.io.DataOutputStream getChunkDataOutputStream(int x, int z)` — Returns an output stream used to write chunk data.
- `boolean isChunkSaved(int x, int z)` — args: x, z, - true if chunk has been saved / converted
- `protected void write(int x, int z, byte[] data, int length)` — args: x, z, data, length - write chunk data at (x, z) to disk
