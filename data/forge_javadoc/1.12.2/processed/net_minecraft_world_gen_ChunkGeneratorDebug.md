# ChunkGeneratorDebug

## Class signature

```java
public class ChunkGeneratorDebug extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `public ChunkGeneratorDebug( World worldIn)`

## Methods

- `public Chunk generateChunk(int x, int z)`
- `public static IBlockState getBlockStateFor(int p_177461_0_, int p_177461_1_)`
- `public void populate(int x, int z)`
- `public boolean generateStructures( Chunk chunkIn, int x, int z)`
- `public java.util.List< Biome.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `public BlockPos getNearestStructurePos( World worldIn, java.lang.String structureName, BlockPos position, boolean findUnexplored)`
- `public boolean isInsideStructure( World worldIn, java.lang.String structureName, BlockPos pos)`
- `public void recreateStructures( Chunk chunkIn, int x, int z)`