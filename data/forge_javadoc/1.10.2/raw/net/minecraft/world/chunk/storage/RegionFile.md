---
title: "RegionFile"
description: "public class RegionFile extends java.lang.Object"
package: "net/minecraft/world/chunk/storage"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/chunk/storage/RegionFile.html"
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
- `void close()`
- `java.io.DataInputStream getChunkDataInputStream(int x, int z)`
- `java.io.DataOutputStream getChunkDataOutputStream(int x, int z)`
- `boolean isChunkSaved(int x, int z)`
- `protected void write(int x, int z, byte[] data, int length)`
