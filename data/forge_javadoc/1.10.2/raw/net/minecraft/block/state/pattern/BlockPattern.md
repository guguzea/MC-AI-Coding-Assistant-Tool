---
title: "BlockPattern"
description: "public class BlockPattern extends java.lang.Object"
package: "net/minecraft/block/state/pattern"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/state/pattern/BlockPattern.html"
sourceType: javadoc
---

# BlockPattern

**Inheritance:** java.lang.Object → net.minecraft.block.state.pattern.BlockPattern

## Class signature

```java
public class BlockPattern extends java.lang.Object
```

## Constructors

- `BlockPattern(com.google.common.base.Predicate<BlockWorldState>[][][] predicatesIn)`

## Methods

- `static com.google.common.cache.LoadingCache<BlockPos, BlockWorldState> createLoadingCache(World worldIn, boolean forceLoadIn)`
- `int getFingerLength()`
- `int getPalmLength()`
- `int getThumbLength()`
- `BlockPattern.PatternHelper match(World worldIn, BlockPos pos)`
- `protected static BlockPos translateOffset(BlockPos pos, EnumFacing finger, EnumFacing thumb, int palmOffset, int thumbOffset, int fingerOffset)`
