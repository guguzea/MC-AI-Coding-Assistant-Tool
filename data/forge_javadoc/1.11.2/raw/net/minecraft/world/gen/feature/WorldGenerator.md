---
title: "WorldGenerator"
description: "public abstract class WorldGenerator extends java.lang.Object"
package: "net/minecraft/world/gen/feature"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/gen/feature/WorldGenerator.html"
sourceType: javadoc
---

# WorldGenerator

**Inheritance:** java.lang.Object → net.minecraft.world.gen.feature.WorldGenerator

## Class signature

```java
public abstract class WorldGenerator extends java.lang.Object
```

## Constructors

- `WorldGenerator()`
- `WorldGenerator(boolean notify)`

## Methods

- `abstract boolean generate(World worldIn, java.util.Random rand, BlockPos position)`
- `protected void setBlockAndNotifyAdequately(World worldIn, BlockPos pos, IBlockState state)`
- `void setDecorationDefaults()`
