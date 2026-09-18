---
title: "BiomeCache"
description: "Removes BiomeCacheBlocks from this cache that haven't been accessed in at least 30 seconds."
package: "net/minecraft/world/biome"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/biome/BiomeCache.html"
sourceType: javadoc
---

# BiomeCache

## Class signature

```java
public class BiomeCache extends java.lang.Object
```

## Constructors

- `public BiomeCache( WorldChunkManager chunkManagerIn)`

## Methods

- `public BiomeCache.Block getBiomeCacheBlock(int x, int z)`
- `public BiomeGenBase func_180284_a(int x, int z, BiomeGenBase p_180284_3_)`
- `public void cleanupCache()`
- `public BiomeGenBase [] getCachedBiomes(int x, int z)`

## Description

Removes BiomeCacheBlocks from this cache that haven't been accessed in at least 30 seconds.
