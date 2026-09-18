# MapGenStructure

## Class signature

```java
public abstract class MapGenStructure extends MapGenBase
```

## Constructors

- `public MapGenStructure()`

## Methods

- `public abstract java.lang.String getStructureName()`
- `protected final void recursiveGenerate( World worldIn, int chunkX, int chunkZ, int p_180701_4_, int p_180701_5_, ChunkPrimer chunkPrimerIn)`
- `public boolean generateStructure( World worldIn, java.util.Random randomIn, ChunkPos chunkCoord)`
- `public boolean isInsideStructure( BlockPos pos)`
- `@Nullable protected StructureStart getStructureAt( BlockPos pos)`
- `public boolean isPositionInStructure( World worldIn, BlockPos pos)`
- `@Nullable public abstract BlockPos getClosestStrongholdPos( World worldIn, BlockPos pos, boolean p_180706_3_)`
- `protected void initializeStructureData( World worldIn)`
- `protected abstract boolean canSpawnStructureAtCoords(int chunkX, int chunkZ)`
- `protected abstract StructureStart getStructureStart(int chunkX, int chunkZ)`
- `protected static BlockPos findNearestStructurePosBySpacing( World p_191069_0_, MapGenStructure p_191069_1_, BlockPos p_191069_2_, int p_191069_3_, int p_191069_4_, int p_191069_5_, boolean p_191069_6_, int p_191069_7_, boolean findUnexplored)`