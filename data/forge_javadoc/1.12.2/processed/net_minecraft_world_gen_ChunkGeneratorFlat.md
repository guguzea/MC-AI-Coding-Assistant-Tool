# ChunkGeneratorFlat

## Class signature

```java
public class ChunkGeneratorFlat extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `public ChunkGeneratorFlat( World worldIn, long seed, boolean generateStructures, java.lang.String flatGeneratorSettings)`

## Methods

- `public Chunk generateChunk(int x, int z)`
- `public void populate(int x, int z)`
- `public boolean generateStructures( Chunk chunkIn, int x, int z)`
- `public java.util.List< Biome.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `public BlockPos getNearestStructurePos( World worldIn, java.lang.String structureName, BlockPos position, boolean findUnexplored)`
- `public boolean isInsideStructure( World worldIn, java.lang.String structureName, BlockPos pos)`
- `public void recreateStructures( Chunk chunkIn, int x, int z)`