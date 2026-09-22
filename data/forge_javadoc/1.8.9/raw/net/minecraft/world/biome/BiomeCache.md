---
title: "BiomeCache"
description: "public class BiomeCache extends java.lang.Object"
package: "net/minecraft/world/biome"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/biome/BiomeCache.html"
sourceType: javadoc
---

# BiomeCache

**Inheritance:** java.lang.Object → net.minecraft.world.biome.BiomeCache

## Class signature

```java
public class BiomeCache extends java.lang.Object
```

## Constructors

- `BiomeCache(WorldChunkManager chunkManagerIn)`

## Methods

- `void cleanupCache()` — Removes BiomeCacheBlocks from this cache that haven't been accessed in at least 30 seconds.
- `BiomeGenBase func_180284_a(int x, int z, BiomeGenBase p_180284_3_)`
- `BiomeCache.Block getBiomeCacheBlock(int x, int z)` — Returns a biome cache block at location specified.
- `BiomeGenBase [] getCachedBiomes(int x, int z)` — Returns the array of cached biome types in the BiomeCacheBlock at the given location.
