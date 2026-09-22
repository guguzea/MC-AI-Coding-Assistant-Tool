---
title: "BlockPattern"
description: "public class BlockPattern extends java.lang.Object"
package: "net/minecraft/block/state/pattern"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/state/pattern/BlockPattern.html"
sourceType: javadoc
---

# BlockPattern

**Inheritance:** java.lang.Object → net.minecraft.block.state.pattern.BlockPattern

## Class signature

```java
public class BlockPattern extends java.lang.Object
```

## Constructors

- `BlockPattern(<any>[][][] predicatesIn)`

## Methods

- `static<any> createLoadingCache(World worldIn, boolean forceLoadIn)`
- `int getFingerLength()`
- `int getPalmLength()`
- `int getThumbLength()`
- `BlockPattern.PatternHelper match(World worldIn, BlockPos pos)`
- `protected static BlockPos translateOffset(BlockPos pos, EnumFacing finger, EnumFacing thumb, int palmOffset, int thumbOffset, int fingerOffset)`
