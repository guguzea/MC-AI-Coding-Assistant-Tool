# ChunkProviderOverworld

## Class signature

```java
public class ChunkProviderOverworld extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `public ChunkProviderOverworld( World worldIn, long seed, boolean mapFeaturesEnabledIn, java.lang.String p_i46668_5_)`

## Methods

- `public void setBlocksInChunk(int x, int z, ChunkPrimer primer)`
- `public void replaceBiomeBlocks(int x, int z, ChunkPrimer primer, Biome [] biomesIn)`
- `public Chunk provideChunk(int x, int z)`
- `public void populate(int x, int z)`
- `public boolean generateStructures( Chunk chunkIn, int x, int z)`
- `public java.util.List< Biome.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `@Nullable public BlockPos getStrongholdGen( World worldIn, java.lang.String structureName, BlockPos position)`
- `public void recreateStructures( Chunk chunkIn, int x, int z)`