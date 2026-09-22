# ChunkCache

**Inheritance:** java.lang.Object → net.minecraft.world.ChunkCache

## Class signature

```java
public class ChunkCache extends java.lang.Object implements IBlockAccess
```

## Constructors

- `ChunkCache(World worldIn, BlockPos posFromIn, BlockPos posToIn, int subIn)`

## Methods

- `Biome getBiome(BlockPos pos)`
- `IBlockState getBlockState(BlockPos pos)`
- `int getCombinedLight(BlockPos pos, int lightValue)`
- `int getLightFor(EnumSkyBlock type, BlockPos pos)`
- `int getStrongPower(BlockPos pos, EnumFacing direction)`
- `TileEntity getTileEntity(BlockPos pos)`
- `TileEntity getTileEntity(BlockPos pos, Chunk.EnumCreateEntityType p_190300_2_)`
- `WorldType getWorldType()`
- `boolean isAirBlock(BlockPos pos)`
- `boolean isEmpty()`
- `boolean isSideSolid(BlockPos pos, EnumFacing side, boolean _default)` — FORGE: isSideSolid, pulled up from World

## Fields

- `protected Chunk [][] chunkArray`
- `protected int chunkX`
- `protected int chunkZ`
- `protected boolean empty`
- `protected World world`