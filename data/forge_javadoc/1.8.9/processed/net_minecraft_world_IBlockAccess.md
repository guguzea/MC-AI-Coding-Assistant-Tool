# IBlockAccess

## Class signature

```java
public interface IBlockAccess
```

## Methods

- `boolean extendedLevelsInChunkCache()` — set by !
- `BiomeGenBase getBiomeGenForCoords(BlockPos pos)`
- `IBlockState getBlockState(BlockPos pos)`
- `int getCombinedLight(BlockPos pos, int lightValue)`
- `int getStrongPower(BlockPos pos, EnumFacing direction)`
- `TileEntity getTileEntity(BlockPos pos)`
- `WorldType getWorldType()`
- `boolean isAirBlock(BlockPos pos)` — Checks to see if an air block exists at the provided location.
- `boolean isSideSolid(BlockPos pos, EnumFacing side, boolean _default)` — FORGE: isSideSolid, pulled up from World