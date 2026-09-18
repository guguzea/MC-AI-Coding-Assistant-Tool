---
title: "BlockPattern"
description: "Calculates whether the given world position matches the pattern."
package: "net/minecraft/block/state/pattern"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/state/pattern/BlockPattern.html"
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

- `public int getThumbLength()`
- `public int getPalmLength()`
- `public BlockPattern.PatternHelper match( World worldIn, BlockPos pos)`
- `public static <any> func_181627_a( World p_181627_0_, boolean p_181627_1_)`
- `protected static BlockPos translateOffset( BlockPos pos, EnumFacing finger, EnumFacing thumb, int palmOffset, int thumbOffset, int fingerOffset)`

## Description

Calculates whether the given world position matches the pattern.
