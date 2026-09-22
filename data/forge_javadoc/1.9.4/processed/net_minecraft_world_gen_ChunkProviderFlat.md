# ChunkProviderFlat

**Inheritance:** java.lang.Object → net.minecraft.world.gen.ChunkProviderFlat

## Class signature

```java
public class ChunkProviderFlat extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `ChunkProviderFlat(World worldIn, long seed, boolean generateStructures, java.lang.String flatGeneratorSettings)`

## Methods

- `boolean generateStructures(Chunk chunkIn, int x, int z)`
- `java.util.List<Biome.SpawnListEntry> getPossibleCreatures(EnumCreatureType creatureType, BlockPos pos)`
- `BlockPos getStrongholdGen(World worldIn, java.lang.String structureName, BlockPos position)`
- `void populate(int x, int z)`
- `Chunk provideChunk(int x, int z)`
- `void recreateStructures(Chunk chunkIn, int x, int z)`