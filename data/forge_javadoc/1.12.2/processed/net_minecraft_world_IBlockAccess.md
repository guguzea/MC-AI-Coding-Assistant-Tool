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