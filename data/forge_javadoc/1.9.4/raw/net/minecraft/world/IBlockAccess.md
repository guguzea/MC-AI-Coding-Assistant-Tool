---
title: "IBlockAccess"
description: "FORGE: isSideSolid, pulled up from World"
package: "net/minecraft/world"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/IBlockAccess.html"
sourceType: javadoc
---

# IBlockAccess

## Class signature

```java
public interface IBlockAccess
```

## Methods

- `@Nullable TileEntity getTileEntity( BlockPos pos)`
- `int getCombinedLight( BlockPos pos, int lightValue)`
- `IBlockState getBlockState( BlockPos pos)`
- `boolean isAirBlock( BlockPos pos)`
- `Biome getBiomeGenForCoords( BlockPos pos)`
- `boolean extendedLevelsInChunkCache()`
- `int getStrongPower( BlockPos pos, EnumFacing direction)`
- `WorldType getWorldType()`
- `boolean isSideSolid( BlockPos pos, EnumFacing side, boolean _default)`

## Description

FORGE: isSideSolid, pulled up from World
