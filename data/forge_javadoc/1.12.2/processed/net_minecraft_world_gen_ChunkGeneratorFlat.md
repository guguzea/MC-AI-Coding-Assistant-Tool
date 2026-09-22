# ChunkGeneratorFlat

**Inheritance:** java.lang.Object → net.minecraft.world.gen.ChunkGeneratorFlat

## Class signature

```java
public class ChunkGeneratorFlat extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `ChunkGeneratorFlat(World worldIn, long seed, boolean generateStructures, java.lang.String flatGeneratorSettings)`

## Methods

- `Chunk generateChunk(int x, int z)`
- `boolean generateStructures(Chunk chunkIn, int x, int z)`
- `BlockPos getNearestStructurePos(World worldIn, java.lang.String structureName, BlockPos position, boolean findUnexplored)`
- `java.util.List<Biome.SpawnListEntry> getPossibleCreatures(EnumCreatureType creatureType, BlockPos pos)`
- `boolean isInsideStructure(World worldIn, java.lang.String structureName, BlockPos pos)`
- `void populate(int x, int z)`
- `void recreateStructures(Chunk chunkIn, int x, int z)`