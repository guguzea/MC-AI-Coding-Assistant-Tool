# ChunkProviderFlat

## Class signature

```java
public class ChunkProviderFlat extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `public ChunkProviderFlat( World worldIn, long seed, boolean generateStructures, java.lang.String flatGeneratorSettings)`

## Methods

- `public Chunk provideChunk(int x, int z)`
- `public void populate(int x, int z)`
- `public boolean generateStructures( Chunk chunkIn, int x, int z)`
- `public java.util.List< Biome.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `@Nullable public BlockPos getStrongholdGen( World worldIn, java.lang.String structureName, BlockPos position)`
- `public void recreateStructures( Chunk chunkIn, int x, int z)`