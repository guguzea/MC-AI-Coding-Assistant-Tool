# IChunkGenerator

## Class signature

```java
public interface IChunkGenerator
```

## Methods

- `Chunk provideChunk(int x, int z)`
- `void populate(int x, int z)`
- `boolean generateStructures( Chunk chunkIn, int x, int z)`
- `java.util.List< Biome.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `@Nullable BlockPos getStrongholdGen( World worldIn, java.lang.String structureName, BlockPos position, boolean p_180513_4_)`
- `void recreateStructures( Chunk chunkIn, int x, int z)`