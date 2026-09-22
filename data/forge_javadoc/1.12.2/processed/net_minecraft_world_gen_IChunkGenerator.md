# IChunkGenerator

## Class signature

```java
public interface IChunkGenerator
```

## Methods

- `Chunk generateChunk(int x, int z)`
- `boolean generateStructures(Chunk chunkIn, int x, int z)`
- `BlockPos getNearestStructurePos(World worldIn, java.lang.String structureName, BlockPos position, boolean findUnexplored)`
- `java.util.List<Biome.SpawnListEntry> getPossibleCreatures(EnumCreatureType creatureType, BlockPos pos)`
- `boolean isInsideStructure(World worldIn, java.lang.String structureName, BlockPos pos)`
- `void populate(int x, int z)`
- `void recreateStructures(Chunk chunkIn, int x, int z)`