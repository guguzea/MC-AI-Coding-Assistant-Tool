---
title: "ExtendedBlockStorage"
description: "public class ExtendedBlockStorage extends java.lang.Object"
package: "net/minecraft/world/chunk/storage"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/chunk/storage/ExtendedBlockStorage.html"
sourceType: javadoc
---

# ExtendedBlockStorage

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.storage.ExtendedBlockStorage

## Class signature

```java
public class ExtendedBlockStorage extends java.lang.Object
```

## Constructors

- `ExtendedBlockStorage(int y, boolean storeSkylight)`

## Methods

- `IBlockState get(int x, int y, int z)`
- `NibbleArray getBlockLight()`
- `int getBlockLight(int x, int y, int z)`
- `BlockStateContainer getData()`
- `NibbleArray getSkyLight()`
- `int getSkyLight(int x, int y, int z)`
- `int getYLocation()`
- `boolean isEmpty()`
- `boolean needsRandomTick()`
- `void recalculateRefCounts()`
- `void set(int x, int y, int z, IBlockState state)`
- `void setBlockLight(int x, int y, int z, int value)`
- `void setBlockLight(NibbleArray newBlocklightArray)`
- `void setSkyLight(int x, int y, int z, int value)`
- `void setSkyLight(NibbleArray newSkylightArray)`
