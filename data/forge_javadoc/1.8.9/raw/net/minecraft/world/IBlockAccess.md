---
title: "IBlockAccess"
description: "set by !"
package: "net/minecraft/world"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/IBlockAccess.html"
sourceType: javadoc
---

# IBlockAccess

## Class signature

```java
public interface IBlockAccess
```

## Methods

- `TileEntity getTileEntity( BlockPos pos)`
- `int getCombinedLight( BlockPos pos, int lightValue)`
- `IBlockState getBlockState( BlockPos pos)`
- `boolean isAirBlock( BlockPos pos)`
- `BiomeGenBase getBiomeGenForCoords( BlockPos pos)`
- `boolean extendedLevelsInChunkCache()`
- `int getStrongPower( BlockPos pos, EnumFacing direction)`
- `WorldType getWorldType()`
- `boolean isSideSolid( BlockPos pos, EnumFacing side, boolean _default)`

## Description

set by !
