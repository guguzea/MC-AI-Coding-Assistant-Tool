---
title: "BlockPattern"
description: "public class BlockPattern extends java.lang.Object"
package: "net/minecraft/block/state/pattern"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/state/pattern/BlockPattern.html"
sourceType: javadoc
---

# BlockPattern

## Class signature

```java
public class BlockPattern extends java.lang.Object
```

## Constructors

- `public BlockPattern(<any>[][][] predicatesIn)`

## Methods

- `public int getFingerLength()`
- `public int getThumbLength()`
- `public int getPalmLength()`
- `public BlockPattern.PatternHelper match( World worldIn, BlockPos pos)`
- `public static <any> createLoadingCache( World worldIn, boolean forceLoadIn)`
- `protected static BlockPos translateOffset( BlockPos pos, EnumFacing finger, EnumFacing thumb, int palmOffset, int thumbOffset, int fingerOffset)`
