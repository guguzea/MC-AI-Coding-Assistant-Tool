---
title: "BlockBarrier"
description: "public class BlockBarrier extends Block"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockBarrier.html"
sourceType: javadoc
---

# BlockBarrier

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockBarrier

## Class signature

```java
public class BlockBarrier extends Block
```

## Methods

- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)` — Spawns this Block's drops into the World as EntityItems.
- `float getAmbientOcclusionLightValue()` — Returns the default ambient occlusion value based on block opacity
- `int getRenderType()` — The type of render function called. 3 for standard block models, 2 for TESR's, 1 for liquids, -1 is no render
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render

## Fields

- `protected BlockBarrier`
