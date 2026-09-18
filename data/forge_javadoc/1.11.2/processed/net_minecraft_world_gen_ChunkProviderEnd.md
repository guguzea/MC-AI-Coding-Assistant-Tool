# ChunkProviderEnd

## Class signature

```java
public class ChunkProviderEnd extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `public ChunkProviderEnd( World p_i47241_1_, boolean p_i47241_2_, long p_i47241_3_, BlockPos p_i47241_5_)`

## Methods

- `public void setBlocksInChunk(int x, int z, ChunkPrimer primer)`
- `public void buildSurfaces( ChunkPrimer primer)`
- `public Chunk provideChunk(int x, int z)`
- `public boolean isIslandChunk(int p_185961_1_, int p_185961_2_)`
- `public void populate(int x, int z)`
- `public boolean generateStructures( Chunk chunkIn, int x, int z)`
- `public java.util.List< Biome.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `@Nullable public BlockPos getStrongholdGen( World worldIn, java.lang.String structureName, BlockPos position, boolean p_180513_4_)`
- `public void recreateStructures( Chunk chunkIn, int x, int z)`