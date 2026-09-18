---
title: "WorldGenerator"
description: "public abstract class WorldGenerator extends java.lang.Object"
package: "net/minecraft/world/gen/feature"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/gen/feature/WorldGenerator.html"
sourceType: javadoc
---

# WorldGenerator

## Class signature

```java
public abstract class WorldGenerator extends java.lang.Object
```

## Constructors

- `public WorldGenerator()`
- `public WorldGenerator(boolean notify)`

## Methods

- `public abstract boolean generate( World worldIn, java.util.Random rand, BlockPos position)`
- `public void setDecorationDefaults()`
- `protected void setBlockAndNotifyAdequately( World worldIn, BlockPos pos, IBlockState state)`
