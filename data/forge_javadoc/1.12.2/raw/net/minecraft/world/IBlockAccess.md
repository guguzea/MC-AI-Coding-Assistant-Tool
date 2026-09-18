---
title: "IBlockAccess"
description: "FORGE: isSideSolid, pulled up from World"
package: "net/minecraft/world"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/IBlockAccess.html"
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
- `Biome getBiome( BlockPos pos)`
- `int getStrongPower( BlockPos pos, EnumFacing direction)`
- `WorldType getWorldType()`
- `boolean isSideSolid( BlockPos pos, EnumFacing side, boolean _default)`

## Description

FORGE: isSideSolid, pulled up from World
