---
title: "WorldGenHugeTrees"
description: "public abstract class WorldGenHugeTrees extends WorldGenAbstractTree"
package: "net/minecraft/world/gen/feature"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/gen/feature/WorldGenHugeTrees.html"
sourceType: javadoc
---

# WorldGenHugeTrees

**Inheritance:** java.lang.Object → net.minecraft.world.gen.feature.WorldGenerator → net.minecraft.world.gen.feature.WorldGenAbstractTree → net.minecraft.world.gen.feature.WorldGenHugeTrees

## Class signature

```java
public abstract class WorldGenHugeTrees extends WorldGenAbstractTree
```

## Constructors

- `WorldGenHugeTrees(boolean notify, int baseHeightIn, int extraRandomHeightIn, IBlockState woodMetadataIn, IBlockState leavesMetadataIn)`

## Methods

- `protected boolean ensureGrowable(World worldIn, java.util.Random rand, BlockPos treePos, int p_175929_4_)`
- `protected int getHeight(java.util.Random rand)`
- `protected void growLeavesLayer(World worldIn, BlockPos layerCenter, int width)`
- `protected void growLeavesLayerStrict(World worldIn, BlockPos layerCenter, int width)`

## Fields

- `protected int baseHeight`
- `protected int extraRandomHeight`
- `protected IBlockState leavesMetadata`
- `protected IBlockState woodMetadata`
