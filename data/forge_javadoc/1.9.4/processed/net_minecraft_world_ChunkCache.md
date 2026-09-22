# ChunkCache

**Inheritance:** java.lang.Object → net.minecraft.world.ChunkCache

## Class signature

```java
public class ChunkCache extends java.lang.Object implements IBlockAccess
```

## Constructors

- `ChunkCache(World worldIn, BlockPos posFromIn, BlockPos posToIn, int subIn)`

## Methods

- `boolean extendedLevelsInChunkCache()`
- `Biome getBiomeGenForCoords(BlockPos pos)`
- `IBlockState getBlockState(BlockPos pos)`
- `int getCombinedLight(BlockPos pos, int lightValue)`
- `int getLightFor(EnumSkyBlock p_175628_1_, BlockPos pos)`
- `int getStrongPower(BlockPos pos, EnumFacing direction)`
- `TileEntity getTileEntity(BlockPos pos)`
- `WorldType getWorldType()`
- `boolean isAirBlock(BlockPos pos)`
- `boolean isSideSolid(BlockPos pos, EnumFacing side, boolean _default)` — FORGE: isSideSolid, pulled up from World

## Fields

- `protected Chunk [][] chunkArray`
- `protected int chunkX`
- `protected int chunkZ`
- `protected boolean hasExtendedLevels`
- `protected World worldObj`