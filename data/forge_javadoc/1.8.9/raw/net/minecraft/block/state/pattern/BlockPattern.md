---
title: "BlockPattern"
description: "public class BlockPattern extends java.lang.Object"
package: "net/minecraft/block/state/pattern"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/state/pattern/BlockPattern.html"
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

- `static<any> func_181627_a(World p_181627_0_, boolean p_181627_1_)`
- `int getPalmLength()`
- `int getThumbLength()`
- `BlockPattern.PatternHelper match(World worldIn, BlockPos pos)` — Calculates whether the given world position matches the pattern.
- `protected static BlockPos translateOffset(BlockPos pos, EnumFacing finger, EnumFacing thumb, int palmOffset, int thumbOffset, int fingerOffset)` — Offsets the position of pos in the direction of finger and thumb facing by offset amounts, follows the right-hand rule for cross products (finger, thumb, palm) @return A new BlockPos offset in the facing directions
