---
title: "IBlockAccess"
description: "public interface IBlockAccess"
package: "net/minecraft/world"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/IBlockAccess.html"
sourceType: javadoc
---

# IBlockAccess

## Class signature

```java
public interface IBlockAccess
```

## Methods

- `Biome getBiome(BlockPos pos)`
- `IBlockState getBlockState(BlockPos pos)`
- `int getCombinedLight(BlockPos pos, int lightValue)`
- `int getStrongPower(BlockPos pos, EnumFacing direction)`
- `TileEntity getTileEntity(BlockPos pos)`
- `WorldType getWorldType()`
- `boolean isAirBlock(BlockPos pos)`
- `boolean isSideSolid(BlockPos pos, EnumFacing side, boolean _default)` — FORGE: isSideSolid, pulled up from World
