# ChunkGeneratorOverworld

**Inheritance:** java.lang.Object → net.minecraft.world.gen.ChunkGeneratorOverworld

## Class signature

```java
public class ChunkGeneratorOverworld extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `ChunkGeneratorOverworld(World worldIn, long seed, boolean mapFeaturesEnabledIn, java.lang.String generatorOptions)`

## Methods

- `Chunk generateChunk(int x, int z)`
- `boolean generateStructures(Chunk chunkIn, int x, int z)`
- `BlockPos getNearestStructurePos(World worldIn, java.lang.String structureName, BlockPos position, boolean findUnexplored)`
- `java.util.List<Biome.SpawnListEntry> getPossibleCreatures(EnumCreatureType creatureType, BlockPos pos)`
- `boolean isInsideStructure(World worldIn, java.lang.String structureName, BlockPos pos)`
- `void populate(int x, int z)`
- `void recreateStructures(Chunk chunkIn, int x, int z)`
- `void replaceBiomeBlocks(int x, int z, ChunkPrimer primer, Biome [] biomesIn)`
- `void setBlocksInChunk(int x, int z, ChunkPrimer primer)`

## Fields

- `NoiseGeneratorOctaves depthNoise`
- `NoiseGeneratorOctaves forestNoise`
- `NoiseGeneratorOctaves scaleNoise`
- `protected static IBlockState STONE`