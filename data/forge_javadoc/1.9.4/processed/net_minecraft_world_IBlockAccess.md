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