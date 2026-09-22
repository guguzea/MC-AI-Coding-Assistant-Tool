# ChunkProviderEnd

**Inheritance:** java.lang.Object → net.minecraft.world.gen.ChunkProviderEnd

## Class signature

```java
public class ChunkProviderEnd extends java.lang.Object implements IChunkGenerator
```

## Constructors

- `ChunkProviderEnd(World p_i47241_1_, boolean p_i47241_2_, long p_i47241_3_, BlockPos p_i47241_5_)`

## Methods

- `void buildSurfaces(ChunkPrimer primer)`
- `boolean generateStructures(Chunk chunkIn, int x, int z)`
- `java.util.List<Biome.SpawnListEntry> getPossibleCreatures(EnumCreatureType creatureType, BlockPos pos)`
- `BlockPos getStrongholdGen(World worldIn, java.lang.String structureName, BlockPos position, boolean p_180513_4_)`
- `boolean isIslandChunk(int p_185961_1_, int p_185961_2_)`
- `void populate(int x, int z)`
- `Chunk provideChunk(int x, int z)`
- `void recreateStructures(Chunk chunkIn, int x, int z)`
- `void setBlocksInChunk(int x, int z, ChunkPrimer primer)`

## Fields

- `protected static IBlockState AIR`
- `protected static IBlockState END_STONE`
- `NoiseGeneratorOctaves noiseGen5`
- `NoiseGeneratorOctaves noiseGen6`