# ChunkGeneratorEnd

## Class signature

```java
public class ChunkGeneratorEnd extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `public ChunkGeneratorEnd( World p_i47241_1_, boolean p_i47241_2_, long p_i47241_3_, BlockPos p_i47241_5_)`

## Methods

- `public void setBlocksInChunk(int x, int z, ChunkPrimer primer)`
- `public void buildSurfaces( ChunkPrimer primer)`
- `public Chunk generateChunk(int x, int z)`
- `public boolean isIslandChunk(int p_185961_1_, int p_185961_2_)`
- `public void populate(int x, int z)`
- `public boolean generateStructures( Chunk chunkIn, int x, int z)`
- `public java.util.List< Biome.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `public BlockPos getNearestStructurePos( World worldIn, java.lang.String structureName, BlockPos position, boolean findUnexplored)`
- `public boolean isInsideStructure( World worldIn, java.lang.String structureName, BlockPos pos)`
- `public void recreateStructures( Chunk chunkIn, int x, int z)`