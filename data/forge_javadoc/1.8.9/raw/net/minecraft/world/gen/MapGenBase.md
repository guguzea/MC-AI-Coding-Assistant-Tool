---
title: "MapGenBase"
description: "public class MapGenBase extends java.lang.Object"
package: "net/minecraft/world/gen"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/gen/MapGenBase.html"
sourceType: javadoc
---

# MapGenBase

**Inheritance:** java.lang.Object → net.minecraft.world.gen.MapGenBase

## Class signature

```java
public class MapGenBase extends java.lang.Object
```

## Constructors

- `MapGenBase()`

## Methods

- `void generate(IChunkProvider chunkProviderIn, World worldIn, int x, int z, ChunkPrimer chunkPrimerIn)`
- `protected void recursiveGenerate(World worldIn, int chunkX, int chunkZ, int p_180701_4_, int p_180701_5_, ChunkPrimer chunkPrimerIn)` — Recursively called by generate()

## Fields

- `protected java.util.Random rand` — The RNG used by the MapGen classes.
- `protected int range` — The number of Chunks to gen-check in any given direction.
- `protected World worldObj` — This world object.
