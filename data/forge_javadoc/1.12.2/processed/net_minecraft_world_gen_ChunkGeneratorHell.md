# ChunkGeneratorHell

## Class signature

```java
public class ChunkGeneratorHell extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `public ChunkGeneratorHell( World worldIn, boolean p_i45637_2_, long seed)`

## Methods

- `public void prepareHeights(int p_185936_1_, int p_185936_2_, ChunkPrimer primer)`
- `public void buildSurfaces(int p_185937_1_, int p_185937_2_, ChunkPrimer primer)`
- `public Chunk generateChunk(int x, int z)`
- `public void populate(int x, int z)`
- `public boolean generateStructures( Chunk chunkIn, int x, int z)`
- `public java.util.List< Biome.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `public BlockPos getNearestStructurePos( World worldIn, java.lang.String structureName, BlockPos position, boolean findUnexplored)`
- `public boolean isInsideStructure( World worldIn, java.lang.String structureName, BlockPos pos)`
- `public void recreateStructures( Chunk chunkIn, int x, int z)`