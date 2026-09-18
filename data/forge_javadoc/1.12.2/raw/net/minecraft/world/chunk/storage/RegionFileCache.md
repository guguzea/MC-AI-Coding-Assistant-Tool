---
title: "RegionFileCache"
description: "public class RegionFileCache extends java.lang.Object"
package: "net/minecraft/world/chunk/storage"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/chunk/storage/RegionFileCache.html"
sourceType: javadoc
---

# RegionFileCache

## Class signature

```java
public class RegionFileCache extends java.lang.Object
```

## Constructors

- `public RegionFileCache()`

## Methods

- `public static RegionFile createOrLoadRegionFile(java.io.File worldDir, int chunkX, int chunkZ)`
- `public static RegionFile getRegionFileIfExists(java.io.File worldDir, int chunkX, int chunkZ)`
- `public static void clearRegionFileReferences()`
- `public static java.io.DataInputStream getChunkInputStream(java.io.File worldDir, int chunkX, int chunkZ)`
- `public static java.io.DataOutputStream getChunkOutputStream(java.io.File worldDir, int chunkX, int chunkZ)`
- `public static boolean chunkExists(java.io.File worldDir, int chunkX, int chunkZ)`
