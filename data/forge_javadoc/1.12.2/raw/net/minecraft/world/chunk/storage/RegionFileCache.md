---
title: "RegionFileCache"
description: "public class RegionFileCache extends java.lang.Object"
package: "net/minecraft/world/chunk/storage"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/chunk/storage/RegionFileCache.html"
sourceType: javadoc
---

# RegionFileCache

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.storage.RegionFileCache

## Class signature

```java
public class RegionFileCache extends java.lang.Object
```

## Constructors

- `RegionFileCache()`

## Methods

- `static boolean chunkExists(java.io.File worldDir, int chunkX, int chunkZ)`
- `static void clearRegionFileReferences()`
- `static RegionFile createOrLoadRegionFile(java.io.File worldDir, int chunkX, int chunkZ)`
- `static java.io.DataInputStream getChunkInputStream(java.io.File worldDir, int chunkX, int chunkZ)`
- `static java.io.DataOutputStream getChunkOutputStream(java.io.File worldDir, int chunkX, int chunkZ)`
- `static RegionFile getRegionFileIfExists(java.io.File worldDir, int chunkX, int chunkZ)`
