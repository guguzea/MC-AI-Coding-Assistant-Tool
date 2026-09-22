---
title: "IGrowable"
description: "public interface IGrowable"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/IGrowable.html"
sourceType: javadoc
---

# IGrowable

## Class signature

```java
public interface IGrowable
```

## Methods

- `boolean canGrow(World worldIn, BlockPos pos, IBlockState state, boolean isClient)` — Whether this IGrowable can grow
- `boolean canUseBonemeal(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `void grow(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
